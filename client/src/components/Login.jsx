import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Toast from './Toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const showToast = (message, type) => {
    setToast(null);
    setTimeout(() => {
      setToast({ message, type });
    }, 10);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return showToast("Kérjük, töltse ki az összes mezőt!", "error");
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      showToast("Sikeres bejelentkezés! Üdvözöljük újra!", "success");

      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 1500);

    } catch (err) {
      showToast(err.response?.data?.message || "Hiba a bejelentkezés során!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-6">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
          duration={5000}
        />
      )}

      <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100">
        <h2 className="text-3xl font-bold mb-2 text-center text-slate-800">Üdvözöljük újra!</h2>
        <p className="text-slate-500 text-center mb-8 font-medium">Jelentkezzen be a foglalás folytatásához</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Email cím</label>
            <input 
              required
              className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white"
              type="email" 
              placeholder="pelda@email.com" 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Jelszó</label>
            <input 
              required
              className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white"
              type="password" 
              placeholder="••••••••" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
          </div>
          
          <button 
            disabled={loading}
            type="submit" 
            className={`w-full py-4 mt-2 rounded-2xl font-bold text-white transition-all shadow-lg ${
              loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
            }`}
          >
            {loading ? 'Bejelentkezés...' : 'Belépés'}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-sm">
          Nincs még fiókja? <Link to="/register" className="text-blue-600 font-bold hover:underline">Regisztráljon most!</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;