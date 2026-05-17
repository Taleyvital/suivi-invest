"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Download,
  Trash2,
  ChevronRight,
  Moon,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { usePortfolio } from "@/app/lib/context";
import { fmt, calcTotals } from "@/app/lib/helpers";
import { PageHeader } from "@/app/components/page-header";
import { Spinner } from "@/app/components/spinner";

export default function SettingsPage() {
  const router = useRouter();
  const { portfolio, hydrated, clearPortfolio } = usePortfolio();

  if (!hydrated) return <Spinner />;

  const totals = calcTotals(portfolio);

  function exportCSV() {
    const header =
      "Ticker,Quantité,PMA (FCFA),Cours actuel (FCFA),Capital investi (FCFA),Valeur actuelle (FCFA),Gain/Perte (FCFA),Rendement (%)";
    const rows = portfolio.map((s) => {
      const invested = s.quantity * s.pma;
      const current  = s.quantity * s.currentPrice;
      const gain     = current - invested;
      const pct      = s.pma > 0 ? ((s.currentPrice - s.pma) / s.pma * 100).toFixed(2) : "0.00";
      return [s.name, s.quantity, s.pma, s.currentPrice, invested, current, gain, pct].join(",");
    });
    const csv  = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `portefeuille_brvm_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleClear() {
    if (
      confirm(
        "Remettre le portefeuille aux données par défaut ? Cette action est irréversible."
      )
    ) {
      clearPortfolio();
      router.push("/");
    }
  }

  return (
    <div className="flex flex-col min-h-dvh bg-[#131313]">
      <PageHeader title="Paramètres" onBack={() => router.push("/")} />

      <main className="flex-1 mt-[56px] pb-12 px-5 flex flex-col gap-6 py-6 overflow-y-auto scrollbar-none">

        {/* Profile card */}
        <div className="bg-[#201f1f] rounded-xl border border-[#414755] px-5 py-5 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#adc6ff]/5 blur-2xl -mr-6 -mt-6 rounded-full pointer-events-none" />
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-white shrink-0 shadow-md shadow-[#4b8eff]/10">
            <Image
              src="/Logo/logo-suivi-invest.png"
              alt="Suivi Invest"
              fill
              className="object-contain p-1"
            />
          </div>
          <div>
            <p className="text-base font-bold text-[#e5e2e1]">Vital</p>
            <p className="text-xs font-mono text-[#8b90a0] mt-0.5">
              PORTEFEUILLE BRVM · {portfolio.length} TITRE{portfolio.length > 1 ? "S" : ""}
            </p>
          </div>
        </div>

        {/* Portfolio summary */}
        <section className="flex flex-col gap-2">
          <h3 className="text-[11px] font-mono text-[#8b90a0] uppercase tracking-widest px-1">
            Résumé
          </h3>
          <div className="bg-[#201f1f] rounded-xl border border-[#414755] overflow-hidden divide-y divide-[#414755]/40">
            {[
              { label: "Capital investi",    value: `${fmt(totals.invested)} FCFA` },
              { label: "Valeur actuelle",    value: `${fmt(totals.current)} FCFA`  },
              {
                label: "Plus/Moins-value",
                value: `${totals.gain >= 0 ? "+" : ""}${fmt(totals.gain)} FCFA`,
                color: totals.gain >= 0 ? "text-[#79ff5b]" : "text-[#ffb4ab]",
              },
              {
                label: "Rendement global",
                value: `${totals.pct >= 0 ? "+" : ""}${totals.pct.toFixed(2)}%`,
                color: totals.pct >= 0 ? "text-[#79ff5b]" : "text-[#ffb4ab]",
              },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex justify-between items-center px-5 py-3.5">
                <span className="text-sm text-[#8b90a0]">{label}</span>
                <span className={`text-sm font-mono font-semibold ${color ?? "text-[#e5e2e1]"}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Data management */}
        <section className="flex flex-col gap-2">
          <h3 className="text-[11px] font-mono text-[#8b90a0] uppercase tracking-widest px-1">
            Data Management
          </h3>
          <div className="bg-[#201f1f] rounded-xl border border-[#414755] overflow-hidden divide-y divide-[#414755]/40">
            <button
              onClick={exportCSV}
              className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[#2a2a2a] active:bg-[#2a2a2a] transition-colors"
            >
              <Download size={18} className="text-[#adc6ff] shrink-0" />
              <span className="text-sm text-[#e5e2e1] flex-1">
                Exporter les données (CSV)
              </span>
              <ChevronRight size={16} className="text-[#8b90a0]" />
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[#2a2a2a] active:bg-[#2a2a2a] transition-colors"
            >
              <RefreshCw size={18} className="text-[#adc6ff] shrink-0" />
              <span className="text-sm text-[#e5e2e1] flex-1">
                Mettre à jour tous les cours
              </span>
              <ChevronRight size={16} className="text-[#8b90a0]" />
            </button>
            <button
              onClick={handleClear}
              className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[#2a2a2a] active:bg-[#2a2a2a] transition-colors"
            >
              <Trash2 size={18} className="text-[#ffb4ab] shrink-0" />
              <span className="text-sm text-[#ffb4ab] flex-1">
                Réinitialiser le portefeuille
              </span>
              <ChevronRight size={16} className="text-[#ffb4ab]/50" />
            </button>
          </div>
        </section>

        {/* Preferences */}
        <section className="flex flex-col gap-2">
          <h3 className="text-[11px] font-mono text-[#8b90a0] uppercase tracking-widest px-1">
            Préférences
          </h3>
          <div className="bg-[#201f1f] rounded-xl border border-[#414755] overflow-hidden divide-y divide-[#414755]/40">
            <div className="flex items-center gap-4 px-5 py-4">
              <span className="text-[#adc6ff] text-base shrink-0">💱</span>
              <span className="text-sm text-[#e5e2e1] flex-1">Devise par défaut</span>
              <span className="text-xs font-mono font-bold text-[#e5e2e1] bg-[#353534] px-2 py-1 rounded-lg">
                FCFA
              </span>
            </div>
            <div className="flex items-center gap-4 px-5 py-4">
              <Moon size={18} className="text-[#adc6ff] shrink-0" />
              <span className="text-sm text-[#e5e2e1] flex-1">Mode Sombre</span>
              <div className="w-11 h-6 bg-[#4b8eff] rounded-full flex items-center justify-end px-0.5 shrink-0">
                <div className="w-5 h-5 bg-white rounded-full shadow" />
              </div>
            </div>
            <div className="flex items-center gap-4 px-5 py-4">
              <ShieldCheck size={18} className="text-[#adc6ff] shrink-0" />
              <div className="flex-1">
                <span className="text-sm text-[#e5e2e1]">Données locales uniquement</span>
                <p className="text-[11px] font-mono text-[#8b90a0] mt-0.5">
                  Aucun serveur, aucun cloud
                </p>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#79ff5b] shadow-[0_0_6px_#79ff5b] shrink-0" />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-2 pb-4">
          <p className="text-[11px] font-mono text-[#414755]">
            Suivi Invest BRVM · Version 1.0
          </p>
          <p className="text-[11px] font-mono text-[#414755] mt-1">
            Vos données financières restent sur votre appareil.
          </p>
        </footer>
      </main>
    </div>
  );
}
