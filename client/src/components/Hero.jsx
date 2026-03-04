import { Car } from 'lucide-react';

const Hero = () => (
  <header className="relative w-full bg-white pt-16 pb-24 overflow-hidden">
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
);

export default Hero;