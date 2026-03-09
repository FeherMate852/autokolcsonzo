import { useEffect, useState } from "react";
import { Car, LogOut, User, Calendar, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
            <div className="flex items-center">
              <div
                className={styles.dropdownContainer}
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <div className={styles.userBox}>
                  <div className={styles.avatar}>
                    <User size={18} />
                  </div>
                  <span className={styles.fullName}>{user.full_name}</span>
                  <span className={styles.arrow}>
                    {isDropdownOpen ? "▲" : "▼"}
                  </span>
                </div>

                {isDropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    <Link to="/profile" className={styles.dropdownItem}>
                      <Calendar size={16} /> Saját foglalásaim
                    </Link>

                    {user.role === "admin" && (
                      <>
                        <div className={styles.divider}></div>
                        <Link
                          to="/admin"
                          className={`${styles.dropdownItem} ${styles.adminLink}`}
                        >
                          <ShieldCheck size={16} /> Admin Felület
                        </Link>
                      </>
                    )}

                    <div className={styles.divider}></div>
                    <button
                      onClick={handleLogout}
                      className={styles.dropdownItem}
                    >
                      <LogOut size={16} className={styles.logoutText} />{" "}
                      <span className={styles.logoutText}>Kijelentkezés</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.actions}>
              <Link to="/login" className={styles.navLink}>
                Bejelentkezés
              </Link>
              <Link to="/register" className={styles.regBtn}>
                Regisztráció
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
