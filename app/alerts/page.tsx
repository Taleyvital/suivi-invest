"use client";

import { Bell, TrendingUp, TrendingDown } from "lucide-react";
import { usePortfolio } from "@/app/lib/context";
import { stockPct, fmtPct, fmt } from "@/app/lib/helpers";
import { BottomNav } from "@/app/components/bottom-nav";
import { Spinner } from "@/app/components/spinner";
import { StockAvatar } from "@/app/components/stock-avatar";

export default function AlertsPage() {
  const { portfolio, hydrated } = usePortfolio();

  if (!hydrated) return <Spinner />;

  // Build automatic alerts based on positions
  const alerts = portfolio
    .map((s) => {
      const pct = stockPct(s);
      const gain = (s.currentPrice - s.pma) * s.quantity;
      return { stock: s, pct, gain };
    })
    .filter(({ pct }) => Math.abs(pct) >= 0) // Show all for now
    .sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct));

  const gains  = alerts.filter((a) => a.pct > 0);
  const losses = alerts.filter((a) => a.pct < 0);
  const flat   = alerts.filter((a) => a.pct === 0);

  return (
    <div className="flex flex-col min-h-dvh bg-[#131313]">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-5 h-[56px] glass-header border-b border-[#414755]/30">
        <div>
          <h1 className="text-base font-bold text-[#e5e2e1] leading-tight">Alertes</h1>
          <span className="text-[10px] font-mono text-[#8b90a0]">Suivi des performances</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#353534] border border-[#414755] flex items-center justify-center text-[#adc6ff]">
          <Bell size={15} />
        </div>
      </header>

      <main className="flex-1 mt-[56px] pb-[88px] px-5 flex flex-col gap-6 py-6 overflow-y-auto scrollbar-none">

        {/* Gains section */}
        {gains.length > 0 && (
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <TrendingUp size={14} className="text-[#79ff5b]" />
              <h3 className="text-[11px] font-mono text-[#79ff5b] uppercase tracking-widest">
                En plus-value ({gains.length})
              </h3>
            </div>
            <div className="flex flex-col gap-2">
              {gains.map(({ stock, pct, gain }) => (
                <AlertCard
                  key={stock.id}
                  stock={stock}
                  pct={pct}
                  gain={gain}
                  type="gain"
                />
              ))}
            </div>
          </section>
        )}

        {/* Losses section */}
        {losses.length > 0 && (
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <TrendingDown size={14} className="text-[#ffb4ab]" />
              <h3 className="text-[11px] font-mono text-[#ffb4ab] uppercase tracking-widest">
                En moins-value ({losses.length})
              </h3>
            </div>
            <div className="flex flex-col gap-2">
              {losses.map(({ stock, pct, gain }) => (
                <AlertCard
                  key={stock.id}
                  stock={stock}
                  pct={pct}
                  gain={gain}
                  type="loss"
                />
              ))}
            </div>
          </section>
        )}

        {/* Flat */}
        {flat.length > 0 && (
          <section className="flex flex-col gap-3">
            <h3 className="text-[11px] font-mono text-[#8b90a0] uppercase tracking-widest px-1">
              À cours inchangé ({flat.length})
            </h3>
            <div className="flex flex-col gap-2">
              {flat.map(({ stock, pct, gain }) => (
                <AlertCard
                  key={stock.id}
                  stock={stock}
                  pct={pct}
                  gain={gain}
                  type="flat"
                />
              ))}
            </div>
          </section>
        )}

        {/* Coming soon notice */}
        <div className="bg-[#201f1f] border border-[#414755]/50 rounded-xl px-5 py-4 flex items-start gap-3 mt-2">
          <Bell size={16} className="text-[#adc6ff] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#e5e2e1]">Alertes de prix — Bientôt</p>
            <p className="text-xs font-mono text-[#8b90a0] mt-1">
              Configurez des seuils de déclenchement (ex: +5%, −10%) pour être notifié lors de la mise à jour des cours.
            </p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function AlertCard({
  stock,
  pct,
  gain,
  type,
}: {
  stock: { id: string; name: string; quantity: number; currentPrice: number };
  pct: number;
  gain: number;
  type: "gain" | "loss" | "flat";
}) {
  const color =
    type === "gain"
      ? { text: "text-[#79ff5b]", bg: "bg-[#79ff5b]/10", border: "border-[#79ff5b]/20" }
      : type === "loss"
      ? { text: "text-[#ffb4ab]", bg: "bg-[#ffb4ab]/10", border: "border-[#ffb4ab]/20" }
      : { text: "text-[#8b90a0]", bg: "bg-[#353534]/30", border: "border-[#414755]/30" };

  return (
    <div
      className={`${color.bg} border ${color.border} rounded-xl px-4 py-3.5 flex items-center justify-between`}
    >
      <div className="flex items-center gap-3">
        <StockAvatar name={stock.name} size={36} />
        <div>
          <p className="text-sm font-bold text-[#e5e2e1]">{stock.name}</p>
          <p className="text-[11px] font-mono text-[#8b90a0]">
            Qté {stock.quantity} · {fmt(stock.currentPrice)} FCFA
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className={`text-sm font-mono font-bold ${color.text}`}>
          {fmtPct(pct)}
        </span>
        <span className={`text-[11px] font-mono ${color.text}`}>
          {gain >= 0 ? "+" : ""}
          {fmt(gain)} FCFA
        </span>
      </div>
    </div>
  );
}
