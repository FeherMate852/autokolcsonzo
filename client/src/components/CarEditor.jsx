import React, { useState } from "react";
import styles from "../styles/CarEditor.module.css";

const CarEditor = ({ onClose, onSave, car }) => {
  const [formData, setFormData] = useState(
    car || { brand: "", model: "", price_per_day: "" },
  );

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
          placeholder="Napi ár"
          value={formData.price_per_day}
          onChange={(e) =>
            setFormData({ ...formData, price_per_day: e.target.value })
          }
        />
        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelBtn}>
            Mégse
          </button>
          <button onClick={() => onSave(formData)} className={styles.saveBtn}>
            Mentés
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarEditor;
