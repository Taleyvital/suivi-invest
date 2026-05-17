"use client";

import { useState, useMemo } from "react";
import { Check, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import { usePortfolio } from "@/app/lib/context";
import { fmt, fmtPct, stockPct, calcTotals } from "@/app/lib/helpers";
import { BottomNav } from "@/app/components/bottom-nav";
import { Spinner } from "@/app/components/spinner";
import { StockAvatar } from "@/app/components/stock-avatar";

export default function MarketPage() {
  const { portfolio, hydrated, updatePrice } = usePortfolio();

  // Local draft prices (ticker → price string)
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const totals = useMemo(() => calcTotals(portfolio), [portfolio]);

  if (!hydrated) return <Spinner />;

  function handleChange(id: string, value: string) {
    setDrafts((prev) => ({ ...prev, [id]: value }));
    setSaved((prev) => ({ ...prev, [id]: false }));
  }

  function handleSave(id: string) {
    const price = Number(drafts[id]);
    if (!price || price <= 0) return;
    updatePrice(id, price);
    setSaved((prev) => ({ ...prev, [id]: true }));
    setDrafts((prev) => ({ ...prev, [id]: "" }));
  }

  function handleSaveAll() {
    portfolio.forEach((s) => {
      const price = Number(drafts[s.id]);
      if (price > 0) {
        updatePrice(s.id, price);
        setSaved((prev) => ({ ...prev, [s.id]: true }));
      }
    });
    setDrafts({});
  }

  const hasDrafts = Object.values(drafts).some((v) => Number(v) > 0);
  const positive = totals.gain >= 0;

  return (
    <div className="flex flex-col min-h-dvh bg-[#131313]">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-5 min-h-[56px] pb-2 glass-header border-b border-[#414755]/30">
        <div className="flex flex-col">
          <h1 className="text-base font-bold text-[#e5e2e1] leading-tight">
            Daily Market Input
          </h1>
          <span className="text-[10px] font-mono text-[#8b90a0]">BRVM · Saisie manuelle</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#79ff5b] shadow-[0_0_6px_#79ff5b]" />
          <span className="text-xs font-mono text-[#79ff5b]">BRVM</span>
        </div>
      </header>

      <main className="flex-1 pb-[88px] px-5 flex flex-col gap-6 py-6 overflow-y-auto scrollbar-none" style={{ marginTop: "calc(56px + env(safe-area-inset-top))" }}>

        {/* Global summary */}
        <section className="glass-card rounded-xl px-5 py-4 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#adc6ff]/5 blur-3xl -mr-8 -mt-8 rounded-full pointer-events-none" />
          <div>
            <p className="text-[10px] font-mono text-[#8b90a0] uppercase tracking-wider">
              Valorisation totale
            </p>
            <p className="text-xl font-bold text-[#e5e2e1] mt-0.5">
              {fmt(totals.current)} <span className="text-sm text-[#8b90a0]">FCFA</span>
            </p>
          </div>
          <div
            className={`flex items-center gap-1 ${
              positive ? "text-[#79ff5b]" : "text-[#ffb4ab]"
            }`}
          >
            {positive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className="text-sm font-mono font-semibold">
              {fmtPct(totals.pct)}
            </span>
          </div>
        </section>

        {/* Instructions */}
        <p className="text-xs font-mono text-[#8b90a0] px-1">
          Saisissez le cours actuel de chaque action, puis validez ligne par ligne ou en une seule fois.
        </p>

        {/* Stock rows */}
        <div className="flex flex-col gap-3">
          {portfolio.map((stock) => {
            const pct = stockPct(stock);
            const draftPrice = drafts[stock.id] ?? "";
            const isSaved = saved[stock.id];
            const draftNum = Number(draftPrice);
            const previewPct =
              draftNum > 0 && stock.pma > 0
                ? ((draftNum - stock.pma) / stock.pma) * 100
                : null;

            return (
              <div
                key={stock.id}
                className="bg-[#201f1f] rounded-xl border border-[#414755] px-4 py-4 flex flex-col gap-3"
              >
                {/* Stock info row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <StockAvatar name={stock.name} size={36} />
                    <div>
                      <p className="text-sm font-bold text-[#e5e2e1]">
                        {stock.name}
                      </p>
                      <p className="text-[11px] font-mono text-[#8b90a0]">
                        Cours actuel : {fmt(stock.currentPrice)} FCFA
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-mono font-semibold ${
                      pct >= 0 ? "text-[#79ff5b]" : "text-[#ffb4ab]"
                    }`}
                  >
                    {fmtPct(pct)}
                  </span>
                </div>

                {/* Price input row */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={draftPrice}
                      onChange={(e) => handleChange(stock.id, e.target.value)}
                      placeholder={String(stock.currentPrice)}
                      min="1"
                      onKeyDown={(e) => e.key === "Enter" && handleSave(stock.id)}
                      className="w-full h-[40px] px-3 bg-[#1c1b1b] border border-[#414755] rounded-lg text-[#e5e2e1] placeholder:text-[#414755] text-sm font-mono input-focus pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#8b90a0]">
                      FCFA
                    </span>
                  </div>
                  <button
                    onClick={() => handleSave(stock.id)}
                    disabled={!draftPrice || draftNum <= 0}
                    className={`w-10 h-[40px] rounded-lg flex items-center justify-center shrink-0 transition-all active:scale-90 disabled:opacity-30 ${
                      isSaved
                        ? "bg-[#79ff5b]/20 border border-[#79ff5b]/30"
                        : "bg-[#4b8eff] "
                    }`}
                  >
                    {isSaved ? (
                      <Check size={16} className="text-[#79ff5b]" />
                    ) : (
                      <Check size={16} className="text-white" />
                    )}
                  </button>
                </div>

                {/* Preview */}
                {previewPct !== null && (
                  <p
                    className={`text-[11px] font-mono ${
                      previewPct >= 0 ? "text-[#79ff5b]" : "text-[#ffb4ab]"
                    }`}
                  >
                    → Nouveau rendement : {fmtPct(previewPct)} · Valeur {fmt(draftNum * stock.quantity)} FCFA
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Validate all button */}
      {hasDrafts && (
        <div className="fixed bottom-[72px] w-full px-5 pb-3 pt-2 bg-gradient-to-t from-[#131313] via-[#131313]/95 to-transparent z-30">
          <button
            onClick={handleSaveAll}
            className="w-full h-[48px] bg-[#4b8eff] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-[#4b8eff]/20"
          >
            <RefreshCw size={16} />
            Valider tous les cours
          </button>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
