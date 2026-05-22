import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Banner } from "@/types";
import { SkeletonBanner } from "./SkeletonCard";

interface Props {
  banners: Banner[];
  loading?: boolean;
  autoPlayMs?: number;
}

export function BannerCarousel({ banners, loading, autoPlayMs = 4000 }: Props) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent(c => (c + 1) % banners.length), [banners.length]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + banners.length) % banners.length), [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const id = setInterval(next, autoPlayMs);
    return () => clearInterval(id);
  }, [banners.length, next, autoPlayMs]);

  useEffect(() => { setCurrent(0); }, [banners.length]);

  if (loading) return <SkeletonBanner />;

  if (!banners.length) {
    return (
      <div className="rounded-xl overflow-hidden bg-brand-gradient flex items-center justify-center text-white" style={{ height: 200 }}>
        <div className="text-center">
          <div className="text-4xl mb-2">❄️</div>
          <div className="font-bold text-xl">M SMART AIRCON</div>
          <div className="text-white/80 text-sm">Premium Home Appliances</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden shadow-md group" style={{ userSelect: "none" }}>
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map(b => (
          <div key={b.id} className="w-full shrink-0 relative" style={{ aspectRatio: "16/5" }}>
            <img
              src={b.imageUrl}
              alt={b.title}
              className="w-full h-full object-cover"
              onError={e => {
                (e.target as HTMLImageElement).parentElement!.style.background = "linear-gradient(135deg,#1e40af,#3b82f6)";
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            {(b.title || b.subtitle) && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-4">
                {b.title && <h2 className="text-white font-bold text-lg leading-tight">{b.title}</h2>}
                {b.subtitle && <p className="text-white/80 text-sm">{b.subtitle}</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all ${i === current ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/50"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
