import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/CarEditor.module.css";

const CarEditor = ({ onClose, onSave, car }) => {
  const [formData, setFormData] = useState(
    car || { brand: "", model: "", price_per_day: "", year: "" },
  );
  const [file, setFile] = useState(null);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{car ? "Autó szerkesztése" : "Új autó hozzáadása"}</h2>

        <input
          placeholder="Márka"
          value={formData.brand}
          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
        />
        <input
          placeholder="Modell"
          value={formData.model}
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
        />
        <input
          type="number"
          placeholder="Évjárat"
          value={formData.year || ""}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
        />
        <input
          type="number"
          placeholder="Napi ár"
          value={formData.price_per_day}
          onChange={(e) =>
            setFormData({ ...formData, price_per_day: e.target.value })
          }
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelBtn}>
            Mégse
          </button>
          <button
            onClick={() => onSave({ ...formData, file })}
            className={styles.saveBtn}
          >
            Mentés
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarEditor;
