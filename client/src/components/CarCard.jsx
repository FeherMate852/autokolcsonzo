import { Shield, MapPin } from 'lucide-react';

const CarCard = ({ car }) => {
  return (
    <div className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden">
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
  );
};

export default CarCard;