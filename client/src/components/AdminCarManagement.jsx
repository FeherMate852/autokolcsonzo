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
      const res = await axios.get("http://localhost:5000/api/cars");
      setCars(res.data);
    } catch (err) {
      console.error("Hiba az autók lekérésekor:", err);
    }
  };

  const handleSave = async (carData) => {
    const token = localStorage.getItem("token");
    try {
      if (editingCar) {
        // Szerkesztés (PUT)
        await axios.put(
          `http://localhost:5000/api/cars/${editingCar.id}`,
          carData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      } else {
        await axios.post("http://localhost:5000/api/cars", carData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchCars();
      setShowEditor(false);
      setEditingCar(null);
    } catch (err) {
      alert("Hiba a mentés során!");
    }
  };

  const deleteCar = async (id) => {
    if (!window.confirm("Biztosan törölni szeretnéd ezt az autót?")) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/cars/${id}`, {
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
            <th>Ár/nap</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.id}>
              <td>{car.brand}</td>
              <td>{car.model}</td>
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
