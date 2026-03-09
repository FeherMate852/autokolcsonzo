const db = require("../config/db");

exports.createBooking = async (req, res) => {
  const { car_id, user_id, start_date, end_date, total_price } = req.body;

  if (!car_id || !user_id || !start_date || !end_date || !total_price) {
    return res.status(400).json({ message: "Minden adat megadása kötelező!" });
  }

  try {
    const query = `
            INSERT INTO bookings (car_id, user_id, start_date, end_date, total_price, status) 
            VALUES ($1, $2, $3, $4, $5, 'pending') 
            RETURNING *`;

    const values = [car_id, user_id, start_date, end_date, total_price];
    const result = await db.query(query, values);

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

exports.getUserBookings = async (req, res) => {
  const { userId } = req.params;
  try {
    const query = `
            SELECT b.*, c.brand, c.model, c.image_url 
            FROM bookings b 
            JOIN cars c ON b.car_id = c.id 
            WHERE b.user_id = $1 
            ORDER BY b.created_at DESC`;

    const result = await db.query(query, [userId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Hiba a lekérésnél:", error);
    res.status(500).json({ message: "Nem sikerült a foglalások betöltése." });
  }
};
