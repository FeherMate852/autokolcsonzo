import { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CarCard from './components/CarCard';
import Footer from './components/Footer';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cars');
        setCars(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Hiba az adatok lekérésekor:", error);
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  return (
    <Router>
      <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900 flex flex-col">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            {/* FŐOLDAL */}
            <Route path="/" element={
              <>
                <Hero />
                <div className="max-w-7xl mx-auto px-6 py-20">
                  <div className="mb-12 text-center md:text-left">
                    <h2 className="text-3xl font-bold mb-2">Elérhető flottánk</h2>
                    <p className="text-slate-500">Válassz a legfrissebb modelljeink közül</p>
                  </div>

                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {[1, 2, 3].map(i => <div key={i} className="h-96 bg-slate-200 animate-pulse rounded-3xl"></div>)}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {cars.length > 0 ? (
                        cars.map((car) => <CarCard key={car.id} car={car} />)
                      ) : (
                        <p className="col-span-full text-center py-10 text-slate-400 italic">Nem található autó az adatbázisban.</p>
                      )}
                    </div>
                  )}
                </div>
              </>
            } />

            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;