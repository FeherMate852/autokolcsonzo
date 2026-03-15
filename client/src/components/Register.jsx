import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Toast from "./Toast";
import styles from "../styles/Register.module.css";

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  // Segédfüggvény a validációhoz
  const isPasswordStrong = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return re.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Mezők kitöltöttsége
    if (
      !formData.full_name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return setToast({
        message: "Minden mező kitöltése kötelező!",
        type: "error",
      });
    }

    // 2. Jelszó erőssége
    if (!isPasswordStrong(formData.password)) {
      return setToast({
        message:
          "A jelszónak min. 8 karakter hosszúnak kell lennie, tartalmaznia kell nagybetűt és számot!",
        type: "error",
      });
    }

    // 3. Jelszavak egyezése
    if (formData.password !== formData.confirmPassword) {
      return setToast({ message: "A két jelszó nem egyezik!", type: "error" });
    }

    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = formData;
      await axios.post("/api/auth/register", submitData);

      setToast({
        message: "Sikeres regisztráció! Átirányítás...",
        type: "success",
      });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || "Hiba történt!",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={toast.type === "success" ? 1500 : 5000}
        />
      )}

      <div className={styles.card}>
        <h2 className={styles.title}>Regisztráció</h2>
        <p className={styles.subtitle}>Hozd létre saját DriveDirect fiókodat</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Teljes név</label>
            <input
              className={styles.input}
              type="text"
              placeholder="pl. Kovács János"
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email cím</label>
            <input
              className={styles.input}
              type="email"
              placeholder="pelda@email.com"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className={styles.passwordGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Jelszó</label>
              <input
                className={styles.input}
                type="password"
                placeholder="••••••••"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Megerősítés</label>
              <input
                className={styles.input}
                type="password"
                placeholder="••••••••"
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className={`${styles.button} ${loading ? styles.buttonDisabled : ""}`}
          >
            {loading ? "Fiók létrehozása..." : "Regisztráció"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
