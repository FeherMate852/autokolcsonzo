import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Toast from './Toast';

const Register = () => {
  const [formData, setFormData] = useState({ 
    full_name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
  setToast(null);
  
  setTimeout(() => {
    setToast({ message, type });
  }, 10);
};

  const isPasswordStrong = (password) => {
    // Min 8 karakter, legalább egy nagybetű és legalább egy szám
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return re.test(password);
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.email || !formData.password || !formData.confirmPassword) {
      return showToast('Minden mező kitöltése kötelező!', 'error');
    }
    
    if (!isPasswordStrong(formData.password)) {
      return showToast('A jelszónak legalább 8 KATAKTER hosszúnak kell lennie, tartalmaznia kell egy NAGYBETŰT és egy SZÁMOT!', 'error');
    }

    if (formData.password !== formData.confirmPassword) {
      return showToast('A két jelszó nem egyezik!', 'error');
    }

    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = formData;
      await axios.post('http://localhost:5000/api/auth/register', submitData);
      
      showToast('Sikeres regisztráció! Átirányítás...', 'success');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      showToast(err.response?.data?.message || "Hiba történt!", 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen pt-16">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100">
      <h2 className="text-3xl font-bold mb-2 text-center text-slate-800">Regisztráció</h2>
      <p className="text-slate-500 text-center mb-8">Hozd létre saját DriveDirect fiókodat</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">Teljes név</label>
          <input 
            className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            type="text" placeholder="pl. Kovács János" 
            onChange={(e) => setFormData({...formData, full_name: e.target.value})} 
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">Email cím</label>
          <input 
            className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            type="email" placeholder="pelda@email.com" 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">Jelszó</label>
            <input 
              className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              type="password" placeholder="••••••••" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">Megerősítés</label>
            <input 
              className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              type="password" placeholder="••••••••" 
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
            />
          </div>
        </div>
        
        <button 
          disabled={loading}
          type="submit" 
          className={`w-full py-4 mt-4 rounded-2xl font-bold text-white transition-all shadow-lg ${
            loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
          }`}
        >
          {loading ? 'Fiók létrehozása...' : 'Regisztráció'}
        </button>
      </form>
    </div>
    </div>
  );
};

export default Register;