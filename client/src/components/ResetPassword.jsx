import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import styles from "../styles/ResetPassword.module.css";
import Toast from "../components/Toast";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [toastConfig, setToastConfig] = useState(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const showToast = (message, type) => {
    setToastConfig({ message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return showToast("A két jelszó nem egyezik meg!", "error");
    }
    if (newPassword.length < 6) {
      return showToast(
        "A jelszónak legalább 6 karakternek kell lennie!",
        "error",
      );
    }

    setLoading(true);

    try {
      const res = await axios.post(`/api/auth/reset-password/${token}`, {
        newPassword,
      });

      showToast(res.data.message, "success");
      setIsSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
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

  const handleCloseToast = () => {
    if (toastConfig?.type === "success") {
      navigate("/login");
    } else {
      setToastConfig(null);
    }
  };

  return (
    <>
      {toastConfig && (
        <Toast
          message={toastConfig.message}
          type={toastConfig.type}
          onClose={handleCloseToast}
        />
      )}

      <div className={styles.container}>
        <h2>Új jelszó megadása</h2>

        {isSuccess ? (
          <div className={styles.successMessage}>
            <p>A jelszavad sikeresen frissítve!</p>
            <Link to="/login" className={styles.loginLink}>
              Irány a bejelentkezés
            </Link>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputWrapper}>
              <input
                type={showNewPassword ? "text" : "password"}
                className={styles.input}
                placeholder="Új jelszó"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className={styles.inputWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={styles.input}
                placeholder="Új jelszó megerősítése"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Mentés..." : "Jelszó megváltoztatása"}
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default ResetPassword;
