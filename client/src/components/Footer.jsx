import { Car } from 'lucide-react';

const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 py-12 px-6">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex items-center gap-2">
        <Car className="text-white" size={24} />
        <span className="text-xl font-bold text-white">DriveDirect</span>
      </div>
      <p>© 2026 DriveDirect Szakdolgozat Projekt. Minden jog fenntartva.</p>
    </div>
  </footer>
);

export default Footer;