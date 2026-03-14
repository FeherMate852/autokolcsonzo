const db = require("../config/db");

exports.addReview = async (req, res) => {
  const { car_id, rating, comment } = req.body;
  const user_id = req.user.id;

  if (!rating) {
    return res.status(400).json({ message: "A csillagos értékelés kötelező!" });
  }

  try {
    const query = `
      INSERT INTO reviews (car_id, user_id, rating, comment) 
      VALUES ($1, $2, $3, $4) RETURNING *
    `;
    const result = await db.query(query, [car_id, user_id, rating, comment]);

    res.status(201).json({
      message: "Köszönjük az értékelést!",
      review: result.rows[0],
    });
  } catch (error) {
    console.error("Hiba az értékelés mentésekor:", error);
    res.status(500).json({ message: "Szerverhiba az értékelés mentésekor." });
  }
};

exports.getReviewsByCar = async (req, res) => {
  const { carId } = req.params;

  try {
    const query = `
      SELECT r.*, u.full_name as user_name 
      FROM reviews r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.car_id = $1 
      ORDER BY r.created_at DESC
    `;
    const result = await db.query(query, [carId]);
    res.json(result.rows);
  } catch (error) {
    console.error("Hiba az értékelések lekérésekor:", error);
    res.status(500).json({ message: "Szerverhiba a vélemények betöltésekor." });
  }
};
