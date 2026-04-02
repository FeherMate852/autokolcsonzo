import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Toast from "./Toast";
import styles from "../styles/Login.module.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      const res = await axios.post("/api/auth/login", formData);
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
            <div className={styles.inputWrapper}>
              <input
                className={styles.input}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <p className={styles.footerText}>
            Elfelejtette a jelszavát?{" "}
            <Link to="/forgot-password" className={styles.link}>
              Kattintson ide!
            </Link>
          </p>

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
