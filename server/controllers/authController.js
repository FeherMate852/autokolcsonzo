const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

exports.register = async (req, res) => {
  const { full_name, email, password } = req.body;

  try {
    const userExists = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "Ez az email cím már foglalt!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.query(
      "INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) RETURNING id, email",
      [full_name, email, hashedPassword],
    );

    res
      .status(201)
      .json({ message: "Sikeres regisztráció!", user: newUser.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Szerver hiba a regisztráció során." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Hibás email vagy jelszó!" });
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Hibás email vagy jelszó!" });
    }

    // Token generálása
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      message: "Sikeres bejelentkezés!",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login hiba:", err);
    res.status(500).json({ error: "Szerver hiba a bejelentkezéskor." });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const userResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: "Ezzel az e-mail címmel nincs regisztrált felhasználó.",
      });
    }

    const user = userResult.rows[0];

    //Generálunk egy egyedi, 64 karakteres tokent
    const resetToken = crypto.randomBytes(32).toString("hex");

    //Kiszámoljuk a lejárati időt (Legyen 1 óra múlva)
    const expireDate = new Date();
    expireDate.setHours(expireDate.getHours() + 1);

    await db.query(
      "UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3",
      [resetToken, expireDate, email],
    );

    //Beállítjuk a Gmail postást (Nodemailer)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `https://autokolcsonzo.onrender.com/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Jelszó visszaállítása - Autókölcsönző",
      html: `
        <h2>Kedves ${user.name || "Felhasználó"}!</h2>
        <p>Kaptunk egy kérést a jelszavad visszaállítására.</p>
        <p>Kattints az alábbi linkre az új jelszavad megadásához (a link 1 óráig érvényes):</p>
        <a href="${resetLink}" style="padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Jelszó visszaállítása</a>
        <p><br>Ha nem te kérted a visszaállítást, nyugodtan hagyd figyelmen kívül ezt az e-mailt.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "A jelszó-visszaállító linket elküldtük az e-mail címedre!",
    });
  } catch (error) {
    console.error("Hiba az elfelejtett jelszó kérésnél:", error);
    res
      .status(500)
      .json({ error: "Szerverhiba történt az e-mail küldésekor." });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const userResult = await db.query(
      "SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()",
      [token],
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({
        message: "A jelszó-visszaállító link érvénytelen vagy lejárt!",
      });
    }

    const user = userResult.rows[0];

    //Titkosítjuk az új jelszót (hogy ne sima szövegként kerüljön az adatbázisba)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.query(
      "UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2",
      [hashedPassword, user.id],
    );

    res.status(200).json({
      message: "A jelszavad sikeresen megváltozott! Most már bejelentkezhetsz.",
    });
  } catch (error) {
    console.error("Hiba a jelszó módosításakor:", error);
    res.status(500).json({ error: "Szerverhiba történt a jelszó mentésekor." });
  }
};
