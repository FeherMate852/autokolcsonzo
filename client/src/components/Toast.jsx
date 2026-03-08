import { useEffect, useState, useRef } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import styles from "../styles/Toast.module.css";

const Toast = ({ message, type, onClose, duration = 5000 }) => {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const remainingTimeRef = useRef(duration);
  const lastTickRef = useRef(Date.now());
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isPaused) {
      lastTickRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const deltaTime = now - lastTickRef.current;
        lastTickRef.current = now;
        remainingTimeRef.current -= deltaTime;

        if (remainingTimeRef.current <= 0) {
          clearInterval(intervalRef.current);
          onClose();
        } else {
          setProgress((remainingTimeRef.current / duration) * 100);
        }
      }, 10);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPaused, onClose, duration]);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`${styles.toast} ${type === "error" ? styles.errorBorder : styles.successBorder}`}
    >
      <div className={styles.content}>
        <div className={styles.messageWrapper}>
          {type === "error" ? (
            <AlertCircle className="text-red-500" size={22} />
          ) : (
            <CheckCircle2 className="text-green-500" size={22} />
          )}
          <p className={styles.messageText}>{message}</p>
        </div>
        <button onClick={onClose} className={styles.closeBtn}>
          <X size={18} />
        </button>
      </div>

      <div className={styles.progressBar}>
        <div
          className={`${styles.progressFill} ${type === "error" ? styles.fillError : styles.fillSuccess}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default Toast;
