import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import BookingManagement from "./BookingManagement";
import AdminCarManagement from "./AdminCarManagement";
import styles from "../styles/AdminDashboard.module.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem("user");

    if (!userStr) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(userStr);

    if (user.role !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  const [activeTab, setActiveTab] = useState("bookings");

  return (
    <div className={styles.adminWrapper}>
      <header className={styles.header}>
        <h1>Adminisztrációs Panel</h1>
        <nav className={styles.nav}>
          <button
            className={`${styles.navButton} ${activeTab === "bookings" ? styles.active : ""}`}
            onClick={() => setActiveTab("bookings")}
          >
            Foglalások
          </button>
          <button
            className={`${styles.navButton} ${activeTab === "cars" ? styles.active : ""}`}
            onClick={() => setActiveTab("cars")}
          >
            Autók kezelése
          </button>
        </nav>
      </header>

      <main className={styles.content}>
        {activeTab === "bookings" ? (
          <BookingManagement />
        ) : (
          <AdminCarManagement />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
