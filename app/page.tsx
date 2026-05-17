"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { Settings, TrendingUp, TrendingDown, Plus } from "lucide-react";
import { usePortfolio } from "./lib/context";
import { calcTotals, fmt, fmtPct, stockPct } from "./lib/helpers";
import { BottomNav } from "./components/bottom-nav";
import { GainBadge } from "./components/gain-badge";
import { SplashScreen } from "./components/splash-screen";
import { StockAvatar } from "./components/stock-avatar";

export default function DashboardPage() {
  const { portfolio, hydrated } = usePortfolio();

  const totals = useMemo(() => calcTotals(portfolio), [portfolio]);
  const positive = totals.gain >= 0;

  if (!hydrated) return <SplashScreen />;

  return (
    <div className="flex flex-col min-h-dvh bg-[#131313]">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-5 h-[56px] glass-header border-b border-[#414755]/30">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-white shrink-0 shadow-sm">
            <Image
              src="/Logo/logo-suivi-invest.png"
              alt="Suivi Invest"
              fill
              className="object-contain p-0.5"
              priority
            />
          </div>
          <h1 className="text-lg font-bold text-[#adc6ff] tracking-tight">
            Bonjour, Youssouf
          </h1>
        </div>
        <Link
          href="/settings"
          className="w-9 h-9 rounded-full bg-[#353534] border border-[#414755] flex items-center justify-center text-[#c1c6d7] active:scale-90 transition-transform"
        >
          <Settings size={15} />
        </Link>
      </header>

      {/* Scrollable content */}
      <main className="flex-1 mt-[56px] pb-[88px] px-5 flex flex-col gap-8 py-6 overflow-y-auto scrollbar-none">

        {/* Hero glassmorphism card */}
        <section className="glass-card rounded-xl p-8 flex flex-col gap-1 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#adc6ff]/10 blur-3xl -mr-10 -mt-10 rounded-full pointer-events-none" />
          <span className="text-[11px] font-mono tracking-widest text-[#c1c6d7] uppercase">
            Valorisation Totale
          </span>
          <h2 className="text-4xl font-bold text-[#e5e2e1] leading-tight mt-1">
            {fmt(totals.current)}{" "}
            <span className="text-2xl font-semibold text-[#8b90a0]">FCFA</span>
          </h2>
          <div
            className={`flex items-center gap-1 mt-1 ${
              positive ? "text-[#79ff5b]" : "text-[#ffb4ab]"
            }`}
          >
            {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span className="text-[13px] font-mono">
              {fmtPct(totals.pct)} ({positive ? "+" : ""}
              {fmt(totals.gain)} FCFA)
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#414755]/40 grid grid-cols-2 gap-2">
            <div>
              <p className="text-[10px] font-mono text-[#8b90a0] uppercase tracking-wider">
                Capital investi
              </p>
              <p className="text-sm font-semibold text-[#e5e2e1]">
                {fmt(totals.invested)} FCFA
              </p>
            </div>
            <div>
              <p className="text-[10px] font-mono text-[#8b90a0] uppercase tracking-wider">
                Plus/Moins-value
              </p>
              <p
                className={`text-sm font-semibold ${
                  positive ? "text-[#79ff5b]" : "text-[#ffb4ab]"
                }`}
              >
                {positive ? "+" : ""}
                {fmt(totals.gain)} FCFA
              </p>
            </div>
          </div>
        </section>

        {/* Market status */}
        <section className="flex flex-col gap-3">
          <h3 className="text-[11px] font-mono text-[#c1c6d7] uppercase tracking-widest px-1">
            Daily Market Input
          </h3>
          <Link
            href="/market"
            className="bg-[#201f1f] rounded-xl border border-[#414755] px-5 py-4 flex items-center justify-between active:bg-[#2a2a2a] transition-colors"
          >
            <div>
              <p className="text-sm font-semibold text-[#e5e2e1]">
                BRVM Composite
              </p>
              <p className="text-xs font-mono text-[#8b90a0] mt-0.5">
                Mettre à jour les cours manuellement →
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#79ff5b] shadow-[0_0_6px_#79ff5b]" />
              <span className="text-xs font-mono text-[#79ff5b]">BRVM</span>
            </div>
          </Link>
        </section>

        {/* Positions */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xl font-bold text-[#e5e2e1]">Mes Positions</h3>
            <span className="text-xs font-mono text-[#adc6ff]">
              {portfolio.length} titres
            </span>
          </div>

          {portfolio.length === 0 ? (
            <div className="bg-[#201f1f] rounded-xl border border-[#414755] px-5 py-10 flex flex-col items-center gap-3">
              <p className="text-sm text-[#8b90a0] text-center">
                Votre portefeuille est vide.
              </p>
              <Link
                href="/add"
                className="text-xs font-mono text-[#adc6ff] border border-[#adc6ff]/30 px-4 py-2 rounded-full"
              >
                + Ajouter une action
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {portfolio.map((stock) => {
                const current = stock.quantity * stock.currentPrice;
                const pct = stockPct(stock);
                return (
                  <Link
                    key={stock.id}
                    href={`/stock/${stock.id}`}
                    className="bg-[#201f1f] rounded-xl border border-[#414755] px-5 py-4 flex items-center justify-between transition-all active:scale-[0.98] active:bg-[#2a2a2a] hover:border-[#adc6ff]/40"
                  >
                    <div className="flex items-center gap-3">
                      <StockAvatar name={stock.name} size={40} />
                      <div>
                        <p className="text-base font-bold text-[#e5e2e1]">
                          {stock.name}
                        </p>
                        <p className="text-xs font-mono text-[#8b90a0]">
                          Qté: {stock.quantity} · PMA {fmt(stock.pma)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-mono text-[#e5e2e1]">
                        {fmt(current)} FCFA
                      </span>
                      <GainBadge value={pct} />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* FAB */}
      <Link
        href="/add"
        className="fixed bottom-24 right-5 w-14 h-14 bg-[#4b8eff] rounded-xl shadow-2xl shadow-[#4b8eff]/30 flex items-center justify-center transition-all active:scale-90 hover:brightness-110 z-50"
      >
        <Plus size={26} className="text-white" />
      </Link>

      <BottomNav />
    </div>
  );
}
