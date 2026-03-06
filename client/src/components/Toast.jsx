import { useEffect, useState, useRef } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

const Toast = ({ message, type, onClose, duration = 5000 }) => {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  
  const progressIntervalRef = useRef(null);
  const remainingTimeRef = useRef(duration);
  const lastTickRef = useRef(Date.now());

  useEffect(() => {
    if (!isPaused) {
      lastTickRef.current = Date.now();
      
      progressIntervalRef.current = setInterval(() => {
        const now = Date.now();
        const deltaTime = now - lastTickRef.current;
        lastTickRef.current = now;

        remainingTimeRef.current -= deltaTime;
        const percentage = (remainingTimeRef.current / duration) * 100;

        if (remainingTimeRef.current <= 0) {
          clearInterval(progressIntervalRef.current);
          setProgress(0);
          onClose();
        } else {
          setProgress(percentage);
        }
      }, 10);
    } else {
      clearInterval(progressIntervalRef.current);
    }

    return () => clearInterval(progressIntervalRef.current);
  }, [isPaused, onClose, duration]);

  const styles = {
    error: "bg-slate-900 text-white border-red-500/40",
    success: "bg-slate-900 text-white border-green-500/40",
    barColor: type === 'error' ? 'bg-red-500' : 'bg-green-500'
  };

  return (
      <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] min-w-[350px] shadow-2xl rounded-2xl border backdrop-blur-md overflow-hidden animate-in fade-in slide-in-from-top-8 duration-300 ${styles[type]}`}>
      <div className="p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {type === 'error' ? (
            <AlertCircle className="text-red-500" size={22} />
          ) : (
            <CheckCircle2 className="text-green-500" size={22} />
          )}
          <p className="font-semibold text-sm tracking-wide">{message}</p>
        </div>
        <button 
          onClick={onClose} 
          className="hover:bg-white/10 p-1.5 rounded-full transition-colors group"
        >
          <X size={18} className="text-slate-400 group-hover:text-white" />
        </button>
      </div>
      
      <div className="h-1.5 w-full bg-white/10">
        <div 
          className={`h-full ${styles.barColor}`} 
          style={{ width: `${progress}%`, transition: 'none' }}
        />
      </div>
    </div>
  );
};

export default Toast;