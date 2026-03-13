const db = require("../config/db");

exports.getAllBookings = async (req, res) => {
  try {
    const query = `
            SELECT b.*, c.brand, c.model, u.full_name as user_name
            FROM bookings b 
            JOIN cars c ON b.car_id = c.id 
            JOIN users u ON b.user_id = u.id
            ORDER BY b.created_at DESC`;

    const result = await db.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Hiba az admin foglalás lekérésnél:", error);
    res.status(500).json({ message: "Nem sikerült lekérni a foglalásokat." });
  }
};

exports.updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db.query("UPDATE bookings SET status = $1 WHERE id = $2", [
      status,
      id,
    ]);
    res.status(200).json({ message: "Státusz frissítve." });
  } catch (error) {
    console.error("Hiba a státusz frissítésnél:", error);
    res.status(500).json({ message: "Nem sikerült frissíteni a státuszt." });
  }
};

exports.deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM bookings WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "A foglalás nem található." });
    }

    res.status(200).json({ message: "Foglalás elutasítva és törölve." });
  } catch (error) {
    console.error("Hiba a foglalás törlésekor:", error);
    res.status(500).json({ message: "Nem sikerült törölni a foglalást." });
  }
};
