import { useEffect, useState } from "react";
import { Car, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <Car color="white" size={24} />
          </div>
          <span className={styles.logoText}>
            Drive<span className={styles.logoHighlight}>Direct</span>
          </span>
        </Link>

        <div className={styles.actions}>
          {user ? (
            <div className="flex items-center gap-6">
              <div className={styles.userBox}>
                <div className={styles.avatar}>
                  <User size={18} />
                </div>
                <span>{user.full_name}</span>
              </div>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                <LogOut size={18} />
                <span className="hidden md:inline">Kijelentkezés</span>
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className={styles.navLink}>
                Bejelentkezés
              </Link>
              <Link to="/register" className={styles.regBtn}>
                Regisztráció
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
