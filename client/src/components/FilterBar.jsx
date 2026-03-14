import { Search, ArrowUpDown, Calendar, Tag } from "lucide-react";
import styles from "../styles/FilterBar.module.css";

const FilterBar = ({
  searchTerm,
  setSearchTerm,
  sortConfig,
  setSortConfig,
}) => {
  const toggleSort = (key) => {
    setSortConfig((prev) => {
      let nextDirection = "";
      if (prev[key] === "") nextDirection = "asc";
      else if (prev[key] === "asc") nextDirection = "desc";
      else nextDirection = "";
      return { ...prev, [key]: nextDirection };
    });
  };

  return (
    <div id="cars-section" className={styles.container}>
      <div className={styles.searchWrapper}>
        <Search className={styles.searchIcon} size={20} />
        <input
          type="text"
          placeholder="Keress márkára vagy modellre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.sortContainer}>
        <span className={styles.label}>Rendezés:</span>

        <button
          onClick={() => toggleSort("price_per_day")}
          className={`${styles.btn} ${sortConfig.price_per_day ? styles.btnActive : styles.btnDefault}`}
        >
          <Tag size={18} />
          Ár{" "}
          {sortConfig.price_per_day === "asc"
            ? "↑"
            : sortConfig.price_per_day === "desc"
              ? "↓"
              : ""}
        </button>

        <button
          onClick={() => toggleSort("year")}
          className={`${styles.btn} ${sortConfig.year ? styles.btnActive : styles.btnDefault}`}
        >
          <Calendar size={18} />
          Évjárat{" "}
          {sortConfig.year === "asc"
            ? "↑"
            : sortConfig.year === "desc"
              ? "↓"
              : ""}
        </button>

        {(searchTerm || sortConfig.price_per_day || sortConfig.year) && (
          <button
            onClick={() => {
              setSearchTerm("");
              setSortConfig({ price_per_day: "", year: "" });
            }}
            className={styles.resetBtn}
          >
            Szűrők törlése
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
