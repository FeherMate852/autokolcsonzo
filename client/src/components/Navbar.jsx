import { Car } from 'lucide-react';
import { Link } from 'react-router-dom'; // Ezt feltétlenül importáld be!

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* A logóra kattintva visszaérünk a főoldalra */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Car className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">Drive<span className="text-blue-600">Direct</span></span>
        </Link>

        <div className="hidden md:flex gap-8 font-medium text-slate-600">
          <Link to="/" className="hover:text-blue-600 transition-colors">Autóink</Link>
          <a href="#" className="hover:text-blue-600 transition-colors">Szolgáltatások</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Kapcsolat</a>
        </div>

        {/* A gomb most már a regisztrációhoz visz */}
        <Link to="/register">
          <button className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200">
            Regisztráció
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;