const db = require("../config/db");

exports.getAllCars = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM cars ORDER BY brand ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Hiba az autók lekérésekor" });
  }
};

exports.updateCar = async (req, res) => {
  const { id } = req.params;
  const { brand, model, price_per_day } = req.body;

  try {
    const query =
      "UPDATE cars SET brand = $1, model = $2, price_per_day = $3 WHERE id = $4";
    const result = await db.query(query, [brand, model, price_per_day, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Az autó nem található." });
    }

    res.status(200).json({ message: "Autó sikeresen frissítve!" });
  } catch (err) {
    console.error("Hiba az update során:", err);
    res
      .status(500)
      .json({ error: "Szerverhiba történt az adatok módosításakor." });
  }
};

exports.addCar = async (req, res) => {
  const { brand, model, image_url, price_per_day } = req.body;
  try {
    const query =
      "INSERT INTO cars (brand, model, image_url, price_per_day) VALUES ($1, $2, $3, $4)";
    await db.query(query, [brand, model, image_url, price_per_day]);
    res.status(201).json({ message: "Autó hozzáadva!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    await db.query("DELETE FROM cars WHERE id = $1", [req.params.id]);
    res.status(200).json({ message: "Autó törölve!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
