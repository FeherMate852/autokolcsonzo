const db = require("../config/db");
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

//Segédfügvén a fájl nevének kinyeréséhez a Supabase URL-ből, hogy törölni tudjuk a régi képet
const extractFileNameFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split("/public/cars/");
  if (parts.length > 1) {
    return parts[1];
  }
  return null;
};

exports.getAllCars = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM cars ORDER BY brand ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Pontos hiba:", err);
    res.status(500).json({ error: "Hiba az autók lekérésekor" });
  }
};

exports.updateCar = async (req, res) => {
  const { id } = req.params;
  const { brand, model, price_per_day, year, fuel_type, transmission } =
    req.body;

  try {
    const oldCarResult = await db.query(
      "SELECT image_url FROM cars WHERE id = $1",
      [id],
    );
    if (oldCarResult.rows.length === 0) {
      return res.status(404).json({ message: "Az autó nem található." });
    }

    const oldImageUrl = oldCarResult.rows[0].image_url;
    let newImageUrl = req.body.image_url;

    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname.replace(/\s/g, "_")}`;

      //Feltöltés a Supabase felhőbe (a RAM-ból: req.file.buffer)
      const { data, error } = await supabase.storage
        .from("cars")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (error) throw error;

      //Végleges link kinyerése
      const { data: publicUrlData } = supabase.storage
        .from("cars")
        .getPublicUrl(fileName);

      newImageUrl = publicUrlData.publicUrl;

      const oldFileName = extractFileNameFromUrl(oldImageUrl);
      if (oldFileName) {
        await supabase.storage.from("cars").remove([oldFileName]);
        console.log("Régi kép sikeresen törölve a Supabase-ről:", oldFileName);
      }
    }

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
  let image_url = req.body.image_url;

  try {
    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname.replace(/\s/g, "_")}`;

      //Kép feltöltése a Storage-ba
      const { data, error } = await supabase.storage
        .from("cars")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (error) throw error;

      //Végleges link kinyerése
      const { data: publicUrlData } = supabase.storage
        .from("cars")
        .getPublicUrl(fileName);

      image_url = publicUrlData.publicUrl;
    }

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
    const fileName = extractFileNameFromUrl(imageUrl);

    if (fileName) {
      const { error } = await supabase.storage.from("cars").remove([fileName]);
      if (!error)
        console.log("Törölt autó képe eltávolítva a Supabase-ről:", fileName);
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
