import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Toast from "./Toast";
import styles from "../styles/Login.module.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password)
      return setToast({
        message: "Kérjük, töltse ki az összes mezőt!",
        type: "error",
      });

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setToast({ message: "Sikeres bejelentkezés!", type: "success" });
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 1500);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || "Hiba!",
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
        <h2 className={styles.title}>Üdvözöljük újra!</h2>
        <p className={styles.subtitle}>
          Jelentkezzen be a foglalás folytatásához
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
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

          <button
            disabled={loading}
            type="submit"
            className={`${styles.button} ${loading ? styles.buttonDisabled : ""}`}
          >
            {loading ? "Bejelentkezés..." : "Belépés"}
          </button>
        </form>

        <p className={styles.footerText}>
          Nincs még fiókja?{" "}
          <Link to="/register" className={styles.link}>
            Regisztráljon most!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
