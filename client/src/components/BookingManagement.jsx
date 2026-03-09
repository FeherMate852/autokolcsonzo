import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/BookingManagement.module.css";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Nincs bejelentkezve!");
        setLoading(false);
        return;
      }

      const res = await axios.get("http://localhost:5000/api/admin/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      setError(
        "Hozzáférés megtagadva vagy hiba történt az adatok lekérésekor!",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/admin/bookings/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchBookings();
    } catch (err) {
      alert("Hiba a státusz frissítésekor!");
    }
  };

  if (loading) return <div className={styles.center}>Betöltés...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Foglalások kezelése (Admin)</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Felhasználó</th>
            <th>Autó</th>
            <th>Időszak</th>
            <th>Státusz</th>
            <th>Művelet</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.user_name}</td>
              <td>
                {b.brand} {b.model}
              </td>
              <td>
                {new Date(b.start_date).toLocaleDateString()} -{" "}
                {new Date(b.end_date).toLocaleDateString()}
              </td>
              <td>
                <span className={`${styles.badge} ${styles[b.status]}`}>
                  {b.status}
                </span>
              </td>
              <td>
                {b.status === "pending" && (
                  <button
                    className={styles.approveBtn}
                    onClick={() => handleStatusChange(b.id, "confirmed")}
                  >
                    Jóváhagyás
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default BookingManagement;
