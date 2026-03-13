const db = require("../config/db");

// 1. Új foglalás létrehozása (Ütközés-ellenőrzéssel)
exports.createBooking = async (req, res) => {
  const { car_id, user_id, start_date, end_date, total_price } = req.body;

  if (!car_id || !user_id || !start_date || !end_date || !total_price) {
    return res.status(400).json({ message: "Minden adat megadása kötelező!" });
  }

  try {
    const overlapQuery = `
      SELECT id FROM bookings 
      WHERE car_id = $1 
      AND status IN ('pending', 'confirmed') 
      AND start_date <= $3 
      AND end_date >= $2
    `;

    const overlapResult = await db.query(overlapQuery, [
      car_id,
      start_date,
      end_date,
    ]);

    if (overlapResult.rows.length > 0) {
      return res.status(409).json({
        message: "Sajnáljuk, de az autó a megadott időszakban már foglalt!",
      });
    }

    const insertQuery = `
            INSERT INTO bookings (car_id, user_id, start_date, end_date, total_price, status) 
            VALUES ($1, $2, $3, $4, $5, 'pending') 
            RETURNING *`;

    const values = [car_id, user_id, start_date, end_date, total_price];
    const result = await db.query(insertQuery, values);

    res.status(201).json({
      success: true,
      message: "Foglalás sikeresen rögzítve!",
      booking: result.rows[0],
    });
  } catch (error) {
    console.error("Hiba a bookingControllerben:", error);
    res.status(500).json({ message: "Szerverhiba a foglalás mentésekor." });
  }
};

// 2. Felhasználó saját foglalásainak lekérése
exports.getUserBookings = async (req, res) => {
  const { userId } = req.params;
  try {
    const query = `
      SELECT b.*, c.brand, c.model, c.image_url 
      FROM bookings b 
      JOIN cars c ON b.car_id = c.id 
      WHERE b.user_id = $1 
      ORDER BY b.created_at DESC
    `;
    const result = await db.query(query, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error("Hiba a saját foglalások lekérésekor:", error);
    res.status(500).json({ message: "Szerverhiba a foglalások lekérésekor." });
  }
};
