import Hero from "../components/Hero";
import FilterBar from "../components/FilterBar";
import CarCard from "../components/CarCard";
import styles from "../styles/HomePage.module.css";

const HomePage = ({
  cars,
  loading,
  searchTerm,
  setSearchTerm,
  sortConfig,
  setSortConfig,
  fuelFilter,
  setFuelFilter,
  transmissionFilter,
  setTransmissionFilter,
}) => (
  <>
    <Hero />
    <main className={styles.main}>
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
        fuelFilter={fuelFilter}
        setFuelFilter={setFuelFilter}
        transmissionFilter={transmissionFilter}
        setTransmissionFilter={setTransmissionFilter}
      />

      <div className={styles.headerSection}>
        <h2 className={styles.title}>Elérhető flottánk</h2>
        <p className={styles.resultCount}>
          Találatok:{" "}
          <span className={styles.highlight}>{cars.length} db autó</span>
        </p>
      </div>

      {loading ? (
        <div className={styles.grid}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.loadingCard}></div>
          ))}
        </div>
      ) : (
        <div className={styles.grid}>
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}

      {cars.length === 0 && !loading && (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>
            Sajnos nincs a keresésnek megfelelő autónk...
          </p>
        </div>
      )}
    </main>
  </>
);

export default HomePage;
