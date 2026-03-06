import { useEffect, useState } from 'react';
import { Car, LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Ellenőrizzük, van-e elmentett felhasználó a belépés után
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Car className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">Drive<span className="text-blue-600">Direct</span></span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            // HA BE VAN LÉPVE
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <User size={18} />
                </div>
                <span>{user.full_name}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 font-semibold hover:text-red-700 transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden md:inline">Kijelentkezés</span>
              </button>
            </div>
          ) : (
            // HA NINCS BE LÉPVE
            <>
              <Link to="/login" className="text-slate-600 font-semibold hover:text-blue-600 transition-colors">
                Bejelentkezés
              </Link>
              <Link to="/register">
                <button className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-blue-600 transition-all shadow-lg">
                  Regisztráció
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;