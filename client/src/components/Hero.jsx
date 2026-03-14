import styles from "../styles/Hero.module.css";

const Hero = () => {
  const scrollToCars = () => {
    const section = document.getElementById("cars-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div>
          <h1 className={styles.title}>
            Utazz stílusosan, <br />
            <span className={styles.blueText}>várakozás nélkül.</span>
          </h1>
          <p className={styles.subtitle}>
            Fedezd fel prémium flottánkat és bérelj autót pár kattintással.
            Átlátható árak, 0-24 ügyfélszolgálat.
          </p>
          <div className={styles.btnGroup}>
            <button
              onClick={scrollToCars}
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              Böngészés
            </button>
            <button className={`${styles.btn} ${styles.btnSecondary}`}>
              Hogyan működik?
            </button>
          </div>
        </div>

        <div className={styles.imageWrapper}>
          <div className={styles.blurCircle}></div>
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800"
            alt="Hero car"
            className={styles.heroImage}
          />
        </div>
      </div>
    </header>
  );
};

export default Hero;
