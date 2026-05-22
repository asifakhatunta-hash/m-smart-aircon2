import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFade(true), 1800);
    const t2 = setTimeout(() => onDone(), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[9999] splash-screen flex flex-col items-center justify-center transition-opacity duration-500 ${fade ? "opacity-0" : "opacity-100"}`}
    >
      <div className="flex flex-col items-center gap-6 animate-bounce-in">
        <div className="w-24 h-24 rounded-3xl bg-brand-gradient flex items-center justify-center shadow-2xl">
          <Zap className="w-12 h-12 text-white" fill="white" />
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-black text-brand-gradient tracking-tight">M SMART AIRCON</h1>
          <p className="mt-2 text-blue-600 font-semibold text-lg">📞 9564060532</p>
          <p className="mt-1 text-slate-500 text-sm">Mitrapur Paikar, Birbhum</p>
        </div>
        <div className="flex gap-1.5 mt-4">
          {[0,1,2].map(i => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-blue-500"
              style={{ animation: `bounce 0.8s ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
