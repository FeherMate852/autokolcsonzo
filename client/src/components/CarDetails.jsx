import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  ChevronLeft,
  CreditCard,
  Info,
  Star,
  Fuel,
  Settings2,
} from "lucide-react";
import Toast from "./Toast";
import styles from "../styles/CarDetails.module.css";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [days, setDays] = useState(0);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/cars/${id}`)
      .then((res) => setCar(res.data));

    axios
      .get(`http://localhost:5000/api/reviews/car/${id}`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("Hiba a vélemények lekérésekor:", err));
  }, [id]);

  useEffect(() => {
    if (startDate && endDate && car) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const diffMs = end - start;
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours >= 1) {
        // Ha 1 óra és 24 óra között van -> 1 nap
        // Ha 24 óra és 1 perc -> 2 nap
        const calculatedDays = Math.ceil(diffHours / 24);

        setDays(calculatedDays);
        setTotalPrice(calculatedDays * car.price_per_day);
      } else {
        setDays(0);
        setTotalPrice(0);
      }
    }
  }, [startDate, endDate, car]);
  const handleBooking = async () => {
    // 1. Ellenőrzés: Be van-e lépve?
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setToast({
        message: "A foglaláshoz be kell jelentkeznie!",
        type: "error",
      });
      setTimeout(() => navigate("/login"), 5000);
      return;
    }

    // 2. Ellenőrzés: Ki vannak-e töltve a dátumok?
    if (!startDate || !endDate) {
      setToast({
        message: "Kérjük, válassza ki az időpontokat!",
        type: "error",
      });
      return;
    }

    // 3. Ellenőrzés: Érvényes-e a tartomány?
    if (days <= 0) {
      setToast({
        message: "A bérlésnek legalább 1 naposnak kell lennie!",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/bookings",
        {
          car_id: id,
          user_id: user.id,
          start_date: startDate,
          end_date: endDate,
          total_price: totalPrice,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setToast({
        message: "Sikeres foglalás! Átirányítás...",
        type: "success",
      });
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Hiba történt a foglalás során!";
      setToast({ message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      return setToast({
        message: "Értékeléshez be kell jelentkezned!",
        type: "error",
      });
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/reviews",
        { car_id: id, rating: reviewForm.rating, comment: reviewForm.comment },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setToast({ message: res.data.message, type: "success" });
      setReviewForm({ rating: 5, comment: "" });

      // Frissítjük a vélemények listáját, hogy az új azonnal megjelenjen
      const reviewsRes = await axios.get(
        `http://localhost:5000/api/reviews/car/${id}`,
      );
      setReviews(reviewsRes.data);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || "Hiba az értékelés küldésekor!",
        type: "error",
      });
    }
  };

  //Átlagszámítás (ha van értékelés)
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  //Kivágjuk a megfelelő 5 elemet a tömbből (lapozáshoz)
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  if (!car) return <div className={styles.container}>Betöltés...</div>;

  return (
    <div className={styles.container}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={toast.type === "success" ? 1500 : 5000}
        />
      )}

      <button onClick={() => navigate(-1)} className={styles.backButton}>
        <ChevronLeft size={20} /> Vissza a flottához
      </button>

      <div className={styles.grid}>
        <div className="space-y-6">
          <img
            src={car.image_url}
            alt={car.model}
            className={styles.carImage}
          />
          <div className={styles.infoSection}>
            <h1 className={styles.title}>
              {car.brand} {car.model}
            </h1>
            <div className={styles.badges}>
              <span className={`${styles.badge} ${styles.yearBadge}`}>
                {car.year}
              </span>
              <span className={`${styles.badge} ${styles.catBadge}`}>
                <Fuel size={18} /> {car.fuel_type}
              </span>
              <span className={`${styles.badge} ${styles.catBadge}`}>
                <Settings2 size={18} /> {car.transmission}
              </span>
            </div>
            <p className={styles.description}>
              "Tapasztalja meg a vezetés élményét ezzel a kiváló állapotú{" "}
              {car.brand}-vel."
            </p>
          </div>
        </div>

        <div className={styles.bookingCard}>
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <Calendar className="text-blue-600" /> Foglalási adatok
          </h3>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Bérlés kezdete (időponttal)</label>
            <input
              type="datetime-local"
              min={new Date().toISOString().slice(0, 16)} // Ma, mostantól
              className={styles.input}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Bérlés vége (időponttal)</label>
            <input
              type="datetime-local"
              min={startDate || new Date().toISOString().slice(0, 16)}
              className={styles.input}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className={styles.priceSummary}>
            <div className={styles.row}>
              <span>Napi díj:</span>{" "}
              <b>{car.price_per_day.toLocaleString()} Ft</b>
            </div>
            <div className={styles.row}>
              <span>Napok száma:</span> <b>{days} nap</b>
            </div>
            <div className={styles.row}>
              <span className={styles.totalText}>Összesen:</span>
              <span className={styles.totalPrice}>
                {totalPrice.toLocaleString()} Ft
              </span>
            </div>
          </div>

          <button
            onClick={handleBooking}
            disabled={loading}
            className={`${styles.bookButton} ${loading ? styles.disabled : ""}`}
          >
            {loading ? (
              "Feldolgozás..."
            ) : (
              <>
                <CreditCard size={22} /> Lefoglalom most
              </>
            )}
          </button>

          <p className={styles.disclaimer}>
            <Info size={12} className="inline mr-1" /> A foglalás gomb
            megnyomásával elfogadja a bérleti feltételeket.
          </p>
        </div>
      </div>

      <div className={styles.reviewsSection}>
        <div className={styles.reviewsHeader}>
          <h2 className={styles.reviewsTitle}>Korábbi bérlők véleményei</h2>
          {reviews.length > 0 && (
            <div className={styles.averageBadge}>
              <Star fill="#f59e0b" color="#f59e0b" size={24} />
              <span>{averageRating} / 5.0</span>
              <span className={styles.reviewCount}>
                ({reviews.length} értékelés)
              </span>
            </div>
          )}
        </div>

        <div className={styles.reviewsGrid}>
          <div className={styles.reviewsList}>
            {reviews.length === 0 ? (
              <p className={styles.noReviews}>
                Még nincsenek értékelések. Legyél te az első!
              </p>
            ) : (
              currentReviews.map((rev) => (
                <div key={rev.id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <strong>{rev.user_name}</strong>
                    <div className={styles.stars}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < rev.rating ? "#f59e0b" : "none"}
                          color={i < rev.rating ? "#f59e0b" : "#cbd5e1"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className={styles.reviewDate}>
                    {new Date(rev.created_at).toLocaleDateString("hu-HU")}
                  </p>
                  {rev.comment && (
                    <p className={styles.reviewComment}>{rev.comment}</p>
                  )}
                </div>
              ))
            )}

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={styles.pageBtn}
                >
                  Előző
                </button>
                <span className={styles.pageInfo}>
                  {currentPage} / {totalPages}. oldal
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={styles.pageBtn}
                >
                  Következő
                </button>
              </div>
            )}
          </div>

          <div className={styles.reviewFormContainer}>
            <h3>Értékeld az autót!</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className={styles.ratingInput}>
                <label>Értékelés (1-5 csillag):</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) =>
                    setReviewForm({
                      ...reviewForm,
                      rating: Number(e.target.value),
                    })
                  }
                  className={styles.input}
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                  <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                  <option value={3}>⭐⭐⭐ (3/5)</option>
                  <option value={2}>⭐⭐ (2/5)</option>
                  <option value={1}>⭐ (1/5)</option>
                </select>
              </div>
              <textarea
                placeholder="Írd le a tapasztalataidat (opcionális)..."
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, comment: e.target.value })
                }
                className={styles.textarea}
                rows="4"
              ></textarea>
              <button type="submit" className={styles.submitReviewBtn}>
                Értékelés elküldése
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
