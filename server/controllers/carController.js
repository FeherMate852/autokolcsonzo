const db = require("../config/db");
const fs = require("fs");
const path = require("path");

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
  const { brand, model, price_per_day, year, fuel_type, transmission } =
    req.body;

  try {
    // 1. Lekérjük az autó régi adatait, hogy tudjuk, mi volt a régi kép URL-je
    const oldCarResult = await db.query(
      "SELECT image_url FROM cars WHERE id = $1",
      [id],
    );
    if (oldCarResult.rows.length === 0) {
      return res.status(404).json({ message: "Az autó nem található." });
    }

    const oldImageUrl = oldCarResult.rows[0].image_url;
    let newImageUrl = req.body.image_url;

    // 2. Ha töltöttek fel új fájlt, beállítjuk az új URL-t, és TÖRÖLJÜK a régit
    if (req.file) {
      newImageUrl = `https://autokolcsonzo.onrender.com/uploads/${req.file.filename}`;

      if (oldImageUrl && oldImageUrl.includes("/uploads/")) {
        const oldFileName = oldImageUrl.split("/uploads/")[1];
        const oldFilePath = path.join(__dirname, "../uploads", oldFileName);

        // Töröljük a fájlt (aszinkron módon, hogy ne akassza meg a kérést)
        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.error(
              "Nem sikerült törölni a régi képet (talán már nem is létezett):",
              err,
            );
          } else {
            console.log(
              "Régi kép sikeresen törölve a szerverről:",
              oldFileName,
            );
          }
        });
      }
    }

    // 3. Frissítjük az adatbázist az új (vagy megtartott) kép URL-lel
    const query =
      "UPDATE cars SET brand = $1, model = $2, price_per_day = $3, image_url = $4, year = $5, fuel_type = $6, transmission = $7 WHERE id = $8";
    await db.query(query, [
      brand,
      model,
      price_per_day,
      newImageUrl,
      year,
      fuel_type,
      transmission,
      id,
    ]);
    res.status(200).json({ message: "Autó sikeresen frissítve!" });
  } catch (err) {
    console.error("Hiba az update során:", err);
    res
      .status(500)
      .json({ error: "Szerverhiba történt az adatok módosításakor." });
  }
};

exports.addCar = async (req, res) => {
  const { brand, model, price_per_day, year, fuel_type, transmission } =
    req.body;

  const image_url = req.file
    ? `https://autokolcsonzo.onrender.com/uploads/${req.file.filename}`
    : req.body.image_url;

  try {
    const query =
      "INSERT INTO cars (brand, model, image_url, price_per_day, year, fuel_type, transmission) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
    const result = await db.query(query, [
      brand,
      model,
      image_url,
      price_per_day,
      year,
      fuel_type,
      transmission,
    ]);
    res
      .status(201)
      .json({ message: "Autó sikeresen hozzáadva!", car: result.rows[0] });
  } catch (err) {
    console.error("Hiba az autó hozzáadásakor:", err);
    res.status(500).json({ error: "Szerverhiba az autó rögzítésekor." });
  }
};

exports.deleteCar = async (req, res) => {
  const { id } = req.params;
  try {
    const carResult = await db.query(
      "SELECT image_url FROM cars WHERE id = $1",
      [id],
    );
    const deleteResult = await db.query(
      "DELETE FROM cars WHERE id = $1 RETURNING *",
      [id],
    );

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ message: "Az autó nem található." });
    }

    const imageUrl = carResult.rows[0].image_url;
    if (imageUrl && imageUrl.includes("/uploads/")) {
      const fileName = imageUrl.split("/uploads/")[1];
      const filePath = path.join(__dirname, "../uploads", fileName);
      fs.unlink(filePath, (err) => {
        if (!err) console.log("Törölt autó képe eltávolítva:", fileName);
      });
    }

    res.json({ message: "Autó sikeresen törölve" });
  } catch (err) {
    console.error("Hiba a törlés során:", err);
    res.status(500).json({ error: "Szerverhiba az autó törlésekor" });
  }
};

exports.getCarById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = "SELECT * FROM cars WHERE id = $1";
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Az autó nem található." });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Hiba az autó lekérésekor:", err);
    res
      .status(500)
      .json({ error: "Szerverhiba történt a részletek lekérésekor." });
  }
};
