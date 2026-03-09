const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
