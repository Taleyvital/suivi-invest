"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function SplashScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 2200;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min((elapsed / duration) * 100, 95);
      setProgress(pct);
      if (elapsed < duration) requestAnimationFrame(tick);
    };

    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#13151a]">
      {/* Logo + titre centré */}
      <div className="flex flex-col items-center gap-8 mb-auto mt-auto">
        <div className="relative w-24 h-24 drop-shadow-[0_0_24px_rgba(75,142,255,0.35)]">
          <Image
            src="/Logo/logo-suivi-invest.png"
            alt="Elite Clarity"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <h1 className="text-[2.6rem] font-black tracking-widest uppercase leading-none">
            <span className="text-white">SUIVI</span>
            <span className="text-[#adc6ff]">-INVEST</span>
          </h1>
          <p className="text-[#6b7280] font-mono text-[13px] tracking-widest">
            Maîtrisez votre portefeuille
          </p>
        </div>
      </div>

      {/* Barre de progression en bas */}
      <div className="w-full px-8 pb-12 flex flex-col gap-3">
        <div className="w-full h-[2px] bg-[#1e2230] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#4b8eff] rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center font-mono text-[10px] tracking-[0.25em] text-[#3d4557] uppercase">
          Chargement des données
        </p>
      </div>
    </div>
  );
}
