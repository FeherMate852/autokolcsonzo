import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Clock, CreditCard, Car } from "lucide-react";
import styles from "../styles/Profile.module.css";

const Profile = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/bookings/user/${user.id}`,
        );
        setBookings(res.data);
      } catch (err) {
        console.error("Hiba a foglalások lekérésekor:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchBookings();
  }, [user?.id]);

  if (loading) return <div className={styles.loading}>Betöltés...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Saját foglalásaim</h1>
        <p className={styles.subtitle}>
          Itt követheted nyomon a korábbi és jelenlegi bérléseidet.
        </p>
      </header>

      {bookings.length === 0 ? (
        <div className={styles.emptyState}>
          <Calendar size={48} />
          <p>Még nincs egyetlen foglalásod sem.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {bookings.map((booking) => (
            <div key={booking.id} className={styles.card}>
              <div className={styles.carImageContainer}>
                <img
                  src={booking.image_url}
                  alt={booking.model}
                  className={styles.carImage}
                />
                <div
                  className={`${styles.statusBadge} ${styles[booking.status]}`}
                >
                  {booking.status === "pending" ? "Függőben" : "Visszaigazolva"}
                </div>
              </div>

              <div className={styles.details}>
                <h3 className={styles.carName}>
                  {booking.brand} {booking.model}
                </h3>

                <div className={styles.infoRow}>
                  <Clock size={16} />
                  <span>
                    {new Date(booking.start_date).toLocaleString("hu-HU", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                    -
                    {new Date(booking.end_date).toLocaleString("hu-HU", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </span>
                </div>

                <div className={styles.infoRow}>
                  <CreditCard size={16} />
                  <span className={styles.price}>
                    {Number(booking.total_price).toLocaleString()} Ft
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
