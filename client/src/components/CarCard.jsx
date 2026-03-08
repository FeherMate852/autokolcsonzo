import styles from "../styles/CarCard.module.css";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CarCard = ({ car }) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={car.image_url} alt={car.model} className={styles.carImage} />
        <div className={styles.yearBadge}>{car.year}</div>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>
              {car.brand} {car.model}
            </h3>
            <p className={styles.category}>{car.category}</p>
          </div>
          <div className={styles.price}>
            <span className={styles.priceValue}>
              {Number(car.price_per_day).toLocaleString()} Ft
            </span>
            <p className={styles.priceUnit}>/ nap</p>
          </div>
        </div>

        <Link to={`/car/${car.id}`} className={styles.detailsLink}>
          Részletek megtekintése
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default CarCard;
