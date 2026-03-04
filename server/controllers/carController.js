const db = require('../config/db');

exports.getAllCars = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM cars ORDER BY brand ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Hiba az autók lekérésekor' });
  }
};