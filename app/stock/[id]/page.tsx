"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Edit2, RefreshCw, Check, X } from "lucide-react";
import { usePortfolio } from "@/app/lib/context";
import {
  fmt,
  fmtPct,
  stockPct,
  chartPath,
} from "@/app/lib/helpers";
import { PageHeader } from "@/app/components/page-header";
import { StatCard } from "@/app/components/stat-card";
import { StockAvatar } from "@/app/components/stock-avatar";
import { GainBadge } from "@/app/components/gain-badge";
import { Spinner } from "@/app/components/spinner";

export default function StockDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { portfolio, hydrated, deleteStock, updatePrice } = usePortfolio();

  const [editingPrice, setEditingPrice] = useState(false);
  const [newPrice, setNewPrice] = useState("");

  if (!hydrated) return <Spinner />;

  const stock = portfolio.find((s) => s.id === id);

  if (!stock) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh bg-[#131313] gap-4 px-5">
        <p className="text-[#8b90a0] text-sm font-mono">Action introuvable.</p>
        <button
          onClick={() => router.push("/")}
          className="text-xs font-mono text-[#adc6ff] border border-[#adc6ff]/30 px-4 py-2 rounded-full"
        >
          ← Retour au portefeuille
        </button>
      </div>
    );
  }

  const invested = stock.quantity * stock.pma;
  const current  = stock.quantity * stock.currentPrice;
  const gain     = current - invested;
  const pct      = stockPct(stock);
  const positive = gain >= 0;
  const path     = chartPath(stock.name, positive);

  function handleDelete() {
    if (!stock) return;
    if (confirm(`Supprimer ${stock.name} de votre portefeuille ?`)) {
      deleteStock(stock.id);
      router.push("/");
    }
  }

  function confirmPrice() {
    if (!stock) return;
    const p = Number(newPrice);
    if (p > 0) {
      updatePrice(stock.id, p);
      setNewPrice("");
      setEditingPrice(false);
    }
  }

  const actions = (
    <div className="flex items-center">
      <button
        onClick={() => router.push(`/add?edit=${stock.id}`)}
        className="w-10 h-10 flex items-center justify-center text-[#adc6ff] active:scale-90 transition-transform"
      >
        <Edit2 size={18} />
      </button>
      <button
        onClick={handleDelete}
        className="w-10 h-10 flex items-center justify-center text-[#ffb4ab] active:scale-90 transition-transform"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );

  return (
    <div className="flex flex-col min-h-dvh bg-[#131313]">
      <PageHeader title="Détails de la position" actions={actions} />

      <main className="flex-1 mt-[56px] pb-36 px-5 flex flex-col gap-5 py-6 overflow-y-auto scrollbar-none">

        {/* Stock header */}
        <section className="flex flex-col gap-1">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <StockAvatar name={stock.name} size={48} />
              <div>
                <h2 className="text-3xl font-bold text-[#d8e2ff] tracking-tight">
                  {stock.name}
                </h2>
                <p className="text-lg font-semibold text-[#e5e2e1] leading-tight">
                  {fmt(stock.currentPrice)}{" "}
                  <span className="text-sm text-[#8b90a0]">FCFA</span>
                </p>
              </div>
            </div>
            <GainBadge value={pct} pill className="mt-1" />
          </div>
        </section>

        {/* Chart */}
        <section className="w-full h-44 relative bg-[#0e0e0e] rounded-xl overflow-hidden border border-[#414755]">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 400 150"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={positive ? "#79ff5b" : "#ffb4ab"}
                  stopOpacity="0.15"
                />
                <stop
                  offset="100%"
                  stopColor={positive ? "#79ff5b" : "#ffb4ab"}
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
            <path
              d={`${path} L400,150 L0,150 Z`}
              fill={`url(#grad-${id})`}
            />
            <path
              d={path}
              fill="none"
              stroke={positive ? "#79ff5b" : "#ffb4ab"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="absolute top-3 right-3 flex gap-1.5">
            {["1D", "1W", "1M"].map((t, i) => (
              <span
                key={t}
                className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                  i === 0
                    ? "bg-[#353534] text-[#e5e2e1]"
                    : "text-[#8b90a0]"
                }`}
              >
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* Bento stats grid */}
        <section className="grid grid-cols-2 gap-3">
          <StatCard label="Quantité" value={String(stock.quantity)} />
          <StatCard
            label="Prix d'achat (PMA)"
            value={`${fmt(stock.pma)} FCFA`}
            mono
          />
          <StatCard
            label="Capital Investi"
            value={`${fmt(invested)} FCFA`}
            mono
          />
          <StatCard
            label={positive ? "Plus-value" : "Moins-value"}
            value={`${positive ? "+" : ""}${fmt(gain)} FCFA`}
            mono
            highlight={positive ? "gain" : "loss"}
          />
        </section>

        {/* Meta details */}
        <section className="border-t border-[#414755]/30 pt-4 flex flex-col gap-3">
          {[
            { label: "Place boursière", value: "BRVM" },
            { label: "Devise", value: "FCFA" },
            { label: "Cours actuel", value: `${fmt(stock.currentPrice)} FCFA` },
            { label: "Valeur actuelle", value: `${fmt(current)} FCFA` },
            { label: "Rendement", value: fmtPct(pct), highlight: positive ? ("gain" as const) : ("loss" as const) },
          ].map(({ label, value, highlight }) => (
            <div key={label} className="flex justify-between items-center py-1">
              <span className="text-sm text-[#8b90a0]">{label}</span>
              <span
                className={`text-sm font-medium ${
                  highlight === "gain"
                    ? "text-[#79ff5b]"
                    : highlight === "loss"
                    ? "text-[#ffb4ab]"
                    : "text-[#e5e2e1]"
                }`}
              >
                {value}
              </span>
            </div>
          ))}
        </section>
      </main>

      {/* Price update footer */}
      <div className="fixed bottom-0 w-full px-5 pb-8 pt-4 bg-gradient-to-t from-[#131313] via-[#131313]/95 to-transparent z-40">
        {editingPrice ? (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder={String(stock.currentPrice)}
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && confirmPrice()}
                className="w-full h-[52px] px-4 bg-[#1c1b1b] border border-[#4b8eff] rounded-xl text-[#e5e2e1] text-sm font-mono input-focus pr-14"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-[#8b90a0] pointer-events-none">
                FCFA
              </span>
            </div>
            <button
              onClick={confirmPrice}
              disabled={!newPrice || Number(newPrice) <= 0}
              className="w-[52px] h-[52px] bg-[#4b8eff] rounded-xl flex items-center justify-center active:scale-90 transition-transform disabled:opacity-40"
            >
              <Check size={20} className="text-white" />
            </button>
            <button
              onClick={() => {
                setNewPrice("");
                setEditingPrice(false);
              }}
              className="w-[52px] h-[52px] bg-[#201f1f] border border-[#414755] rounded-xl flex items-center justify-center active:scale-90 transition-transform"
            >
              <X size={20} className="text-[#c1c6d7]" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditingPrice(true)}
            className="w-full h-[52px] bg-[#4b8eff] text-white font-bold text-base rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-[#4b8eff]/20"
          >
            <RefreshCw size={18} />
            Mettre à jour le cours
          </button>
        )}
      </div>
    </div>
  );
}
