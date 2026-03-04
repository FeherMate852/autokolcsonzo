const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  const { full_name, email, password } = req.body;

  try {
    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "Ez az email cím már foglalt!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.query(
      'INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) RETURNING id, email',
      [full_name, email, hashedPassword]
    );

    res.status(201).json({ message: "Sikeres regisztráció!", user: newUser.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Szerver hiba a regisztráció során." });
  }
};