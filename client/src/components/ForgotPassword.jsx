import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "../styles/ForgotPassword.module.css";
import Toast from "../components/Toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastConfig, setToastConfig] = useState(null);

  const showToast = (message, type) => {
    setToastConfig({ message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/forgot-password", { email });

      showToast(res.data.message, "success");

      setEmail("");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Hiba történt a kérés során.";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toastConfig && (
        <Toast
          message={toastConfig.message}
          type={toastConfig.type}
          onClose={() => setToastConfig(null)}
        />
      )}

      <div className={styles.container}>
        <h2>Elfelejtett jelszó</h2>
        <p className={styles.description}>
          Add meg a regisztrált e-mail címedet, és küldünk egy linket a
          visszaállításhoz.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            className={styles.input}
            placeholder="E-mail címed"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Küldés folyamatban..." : "Visszaállító link küldése"}
          </button>
        </form>

        <Link to="/login" className={styles.backLink}>
          ← Vissza a bejelentkezéshez
        </Link>
      </div>
    </>
  );
};

export default ForgotPassword;
