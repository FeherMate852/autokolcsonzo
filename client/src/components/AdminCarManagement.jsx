import React, { useEffect, useState } from "react";
import axios from "axios";
import CarEditor from "./CarEditor";
import styles from "../styles/AdminCarManagement.module.css";

const AdminCarManagement = () => {
  const [cars, setCars] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await axios.get(
        "https://autokolcsonzo.onrender.com/api/cars",
      );
      setCars(res.data);
    } catch (err) {
      console.error("Hiba az autók lekérésekor:", err);
    }
  };

  const handleSave = async (carData) => {
    const token = localStorage.getItem("token");

    const sendData = new FormData();
    sendData.append("brand", carData.brand);
    sendData.append("model", carData.model);
    sendData.append("price_per_day", carData.price_per_day);
    sendData.append("year", carData.year);
    sendData.append("fuel_type", carData.fuel_type);
    sendData.append("transmission", carData.transmission);

    if (carData.file) {
      sendData.append("image", carData.file);
    } else if (carData.image_url) {
      sendData.append("image_url", carData.image_url);
    }

    try {
      if (editingCar) {
        await axios.put(
          `https://autokolcsonzo.onrender.com/api/cars/${editingCar.id}`,
          sendData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
      } else {
        await axios.post(
          "https://autokolcsonzo.onrender.com/api/cars",
          sendData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
      }
      setShowEditor(false);
      setEditingCar(null);
      fetchCars();
    } catch (err) {
      console.error("Hiba mentéskor:", err);
    }
  };

  const deleteCar = async (id) => {
    if (!window.confirm("Biztosan törölni szeretnéd ezt az autót?")) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://autokolcsonzo.onrender.com/api/cars/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCars();
    } catch (err) {
      alert("Hiba a törlés során!");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Autóflotta kezelése</h1>
        <button className={styles.addBtn} onClick={() => setShowEditor(true)}>
          + Új autó hozzáadása
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Márka</th>
            <th>Modell</th>
            <th>Évjárat</th>
            <th>Üzemanyag</th>
            <th>Váltó</th>
            <th>Ár/nap</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.id}>
              <td>{car.brand}</td>
              <td>{car.model}</td>
              <td>{car.year}</td>
              <td>{car.fuel_type}</td>
              <td>{car.transmission}</td>
              <td>{car.price_per_day} Ft</td>
              <td>
                <button
                  className={styles.editBtn}
                  onClick={() => {
                    setEditingCar(car);
                    setShowEditor(true);
                  }}
                >
                  Szerkesztés
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => deleteCar(car.id)}
                >
                  Törlés
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showEditor && (
        <CarEditor
          onClose={() => {
            setShowEditor(false);
            setEditingCar(null);
          }}
          onSave={handleSave}
          car={editingCar}
        />
      )}
    </div>
  );
};

export default AdminCarManagement;
