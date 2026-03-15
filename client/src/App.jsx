import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Register from "./components/Register";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import CarDetails from "./components/CarDetails";
import HomePage from "./components/HomePage";
import Profile from "./components/Profile.jsx";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Szűrők állapotai
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ price_per_day: "", year: "" });
  const [fuelFilter, setFuelFilter] = useState("");
  const [transmissionFilter, setTransmissionFilter] = useState("");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(
          "https://autokolcsonzo.onrender.com/api/cars",
        );
        setCars(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Hiba:", error);
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const filteredAndSortedCars = useMemo(() => {
    let result = [...cars];

    //Keresés névre (Márka + Modell)
    if (searchTerm) {
      const cleanSearch = searchTerm.trim().toLowerCase();
      result = result.filter((car) =>
        `${car.brand} ${car.model}`.toLowerCase().includes(cleanSearch),
      );
    }

    //Szűrés Üzemanyagra
    if (fuelFilter) {
      result = result.filter((car) => car.fuel_type === fuelFilter);
    }

    //Szűrés Váltóra
    if (transmissionFilter) {
      result = result.filter((car) => car.transmission === transmissionFilter);
    }

    //Rendezés
    result.sort((a, b) => {
      if (sortConfig.price_per_day) {
        const valA = Number(a.price_per_day);
        const valB = Number(b.price_per_day);
        if (valA !== valB)
          return sortConfig.price_per_day === "asc" ? valA - valB : valB - valA;
      }
      if (sortConfig.year) {
        const valA = Number(a.year);
        const valB = Number(b.year);
        if (valA !== valB)
          return sortConfig.year === "asc" ? valA - valB : valB - valA;
      }
      return 0;
    });

    return result;
  }, [cars, searchTerm, sortConfig, fuelFilter, transmissionFilter]);

  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  cars={filteredAndSortedCars}
                  loading={loading}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  sortConfig={sortConfig}
                  setSortConfig={setSortConfig}
                  fuelFilter={fuelFilter}
                  setFuelFilter={setFuelFilter}
                  transmissionFilter={transmissionFilter}
                  setTransmissionFilter={setTransmissionFilter}
                />
              }
            />
            <Route
              path="/login"
              element={
                <ProtectedRoute reverse={true}>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path="/register"
              element={
                <ProtectedRoute reverse={true}>
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route path="/car/:id" element={<CarDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
