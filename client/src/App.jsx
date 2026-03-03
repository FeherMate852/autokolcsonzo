import { useEffect, useState } from 'react';
import axios from 'axios';
import { Car, Calendar, Shield, MapPin, Search } from 'lucide-react';

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
        console.error("Hiba:", error);
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* 1. Navigáció */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Car className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">Drive<span className="text-blue-600">Direct</span></span>
          </div>
          <div className="hidden md:flex gap-8 font-medium text-slate-600">
            <a href="#" className="hover:text-blue-600 transition-colors">Autóink</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Szolgáltatások</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Kapcsolat</a>
          </div>
          <button className="bg-slate-900 text-white px-5 py-2 rounded-full font-medium hover:bg-slate-800 transition-all">
            Bejelentkezés
          </button>
        </div>
      </nav>

      {/* 2. Hero Szekció */}
      <header className="relative bg-white pt-16 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Utazz stílusosan, <br />
              <span className="text-blue-600">várakozás nélkül.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-lg">
              Fedezd fel prémium flottánkat és bérelj autót pár kattintással. 
              Átlátható árak, 0-24 ügyfélszolgálat.
            </p>
            <div className="flex gap-4">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                Böngészés
              </button>
              <button className="border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                Hogyan működik?
              </button>
            </div>
          </div>
          <div className="relative">
             <div className="absolute -z-10 top-0 right-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
             <img 
               src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800" 
               alt="Hero car" 
               className="rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500"
             />
          </div>
        </div>
      </header>

      {/* 3. Flotta szekció */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Elérhető flottánk</h2>
            <p className="text-slate-500">Válassz a legfrissebb modelljeink közül</p>
          </div>
          
          {/* Egyszerű szűrő sáv */}
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            <button className="px-4 py-2 bg-slate-100 rounded-lg font-medium">Összes</button>
            <button className="px-4 py-2 hover:bg-slate-50 rounded-lg font-medium transition-colors">SUV</button>
            <button className="px-4 py-2 hover:bg-slate-50 rounded-lg font-medium transition-colors">Elektromos</button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1,2,3].map(i => <div key={i} className="h-96 bg-slate-200 animate-pulse rounded-3xl"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => (
              <div key={car.id} className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={car.image_url} 
                    alt={car.model} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {car.year}
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800">{car.brand}</h3>
                      <p className="text-slate-500 font-medium">{car.model}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-blue-600">{Number(car.price_per_day).toLocaleString()} Ft</p>
                      <p className="text-xs text-slate-400 font-bold uppercase">/ nap</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-2 text-slate-500 text-sm bg-slate-50 p-2 rounded-xl">
                      <Shield size={16} className="text-blue-500" />
                      <span>Teljes biztosítás</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-sm bg-slate-50 p-2 rounded-xl">
                      <MapPin size={16} className="text-blue-500" />
                      <span>GPS ingyen</span>
                    </div>
                  </div>

                  <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold group-hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center gap-2">
                    Lefoglalom
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 4. Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Car className="text-white" size={24} />
            <span className="text-xl font-bold text-white">DriveDirect</span>
          </div>
          <p>© 2024 DriveDirect Szakdolgozat Projekt. Minden jog fenntartva.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;