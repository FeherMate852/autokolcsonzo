const express = require('express');
const router = express.Router();
const db = require('../db');

// Összes autó lekérése
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM cars ORDER BY brand ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Hiba az autók lekérésekor' });
  }
});

// Egy konkrét autó lekérése ID alapján
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM cars WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Autó nem található' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;