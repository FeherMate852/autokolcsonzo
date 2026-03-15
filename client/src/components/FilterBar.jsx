import { Search, Calendar, Tag, Fuel, Settings2 } from "lucide-react";
import styles from "../styles/FilterBar.module.css";

const FilterBar = ({
  searchTerm,
  setSearchTerm,
  sortConfig,
  setSortConfig,
  fuelFilter,
  setFuelFilter,
  transmissionFilter,
  setTransmissionFilter,
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
  const hasActiveFilters =
    searchTerm ||
    sortConfig.price_per_day ||
    sortConfig.year ||
    fuelFilter ||
    transmissionFilter;

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

      <div className={styles.dropdownFilters}>
        <div className={styles.selectWrapper}>
          <Fuel className={styles.selectIcon} size={16} />
          <select
            value={fuelFilter}
            onChange={(e) => setFuelFilter(e.target.value)}
            className={styles.select}
          >
            <option value="">Összes üzemanyag</option>
            <option value="Benzin">Benzin</option>
            <option value="Dízel">Dízel</option>
            <option value="Elektromos">Elektromos</option>
            <option value="Hibrid">Hibrid</option>
          </select>
        </div>

        <div className={styles.selectWrapper}>
          <Settings2 className={styles.selectIcon} size={16} />
          <select
            value={transmissionFilter}
            onChange={(e) => setTransmissionFilter(e.target.value)}
            className={styles.select}
          >
            <option value="">Összes váltó</option>
            <option value="Manuális">Manuális</option>
            <option value="Automata">Automata</option>
          </select>
        </div>
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

        {hasActiveFilters && (
          <button
            onClick={() => {
              setSearchTerm("");
              setSortConfig({ price_per_day: "", year: "" });
              setFuelFilter("");
              setTransmissionFilter("");
            }}
            className={styles.resetBtn}
          >
            Törlés
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
