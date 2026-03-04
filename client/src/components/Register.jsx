import { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Hiba történt!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
      <h2 className="text-3xl font-bold mb-6 text-center">Regisztráció</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
          type="text" placeholder="Teljes név" 
          onChange={(e) => setFormData({...formData, full_name: e.target.value})} 
        />
        <input 
          className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
          type="email" placeholder="Email cím" 
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
        />
        <input 
          className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
          type="password" placeholder="Jelszó" 
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all">
          Fiók létrehozása
        </button>
      </form>
      {message && <p className="mt-4 text-center text-blue-600 font-medium">{message}</p>}
    </div>
  );
};

export default Register;