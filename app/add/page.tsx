"use client";

import { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Calculator, Plus, Check } from "lucide-react";
import { usePortfolio } from "@/app/lib/context";
import { fmt } from "@/app/lib/helpers";
import { PageHeader } from "@/app/components/page-header";
import { Spinner } from "@/app/components/spinner";

function AddStockForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const { portfolio, hydrated, addStock, updateStock } = usePortfolio();
  const editStock = editId ? portfolio.find((s) => s.id === editId) : undefined;
  const isEdit = !!editStock;

  const [name, setName]     = useState(editStock?.name ?? "");
  const [qty, setQty]       = useState<string>(editStock ? String(editStock.quantity) : "");
  const [pma, setPma]       = useState<string>(editStock ? String(editStock.pma) : "");

  const estimated = useMemo(() => {
    const q = Number(qty);
    const p = Number(pma);
    return q > 0 && p > 0 ? q * p : 0;
  }, [qty, pma]);

  const valid = name.trim().length > 0 && Number(qty) > 0 && Number(pma) > 0;

  if (!hydrated) return <Spinner />;

  function handleSubmit() {
    if (!valid) return;
    const data = {
      name: name.trim().toUpperCase(),
      quantity: Number(qty),
      pma: Number(pma),
      currentPrice: isEdit ? (editStock?.currentPrice ?? Number(pma)) : Number(pma),
    };
    if (isEdit && editId) {
      updateStock(editId, { name: data.name, quantity: data.quantity, pma: data.pma });
    } else {
      addStock(data);
    }
    router.push("/");
  }

  return (
    <div className="flex flex-col min-h-dvh bg-[#131313]">
      <PageHeader title={isEdit ? "Modifier la position" : "Nouvelle Action"} />

      <main className="flex-1 mt-[56px] pb-36 px-5 flex flex-col gap-6 py-6 overflow-y-auto scrollbar-none">

        {/* Ticker */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-mono text-[#8b90a0] uppercase tracking-wider ml-1">
            Nom de l&apos;action (Ticker)
          </label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              placeholder="ex: CIE"
              maxLength={10}
              className="w-full h-[44px] px-4 bg-[#1c1b1b] border border-[#414755] rounded-xl text-[#e5e2e1] placeholder:text-[#414755] input-focus text-sm font-bold tracking-wider pr-10"
            />
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#414755] pointer-events-none" />
          </div>
        </div>

        {/* Quantity */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-mono text-[#8b90a0] uppercase tracking-wider ml-1">
            Nombre d&apos;actions
          </label>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="0"
            min="1"
            className="w-full h-[44px] px-4 bg-[#1c1b1b] border border-[#414755] rounded-xl text-[#e5e2e1] placeholder:text-[#414755] input-focus text-sm font-mono"
          />
        </div>

        {/* PMA */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-mono text-[#8b90a0] uppercase tracking-wider ml-1">
            Prix Moyen d&apos;Achat (PMA)
          </label>
          <div className="relative">
            <input
              type="number"
              value={pma}
              onChange={(e) => setPma(e.target.value)}
              placeholder="0"
              min="1"
              className="w-full h-[44px] px-4 bg-[#1c1b1b] border border-[#414755] rounded-xl text-[#e5e2e1] placeholder:text-[#414755] input-focus text-sm font-mono pr-16"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-[#8b90a0] pointer-events-none">
              FCFA
            </span>
          </div>
        </div>

        {/* Capital estimate */}
        <div className="bg-[#201f1f] border border-[#414755] rounded-xl px-5 py-4 flex items-center justify-between relative overflow-hidden">
          <div className="absolute -top-8 -left-8 w-20 h-20 bg-[#adc6ff]/5 blur-3xl rounded-full pointer-events-none" />
          <div className="flex flex-col gap-1 relative z-10">
            <span className="text-[10px] font-mono text-[#8b90a0] uppercase tracking-wider">
              Estimation de l&apos;investissement
            </span>
            <span className="text-lg font-bold text-[#e5e2e1]">
              Capital estimé : {fmt(estimated)} FCFA
            </span>
          </div>
          <div className="w-10 h-10 flex items-center justify-center bg-[#2a2a2a] rounded-full border border-[#414755]/30 text-[#adc6ff] relative z-10 shrink-0">
            <Calculator size={18} />
          </div>
        </div>

        {/* Decorative chart card */}
        <div className="rounded-xl overflow-hidden h-32 border border-[#414755] relative bg-[#0e0e0e] flex items-end">
          <div className="absolute inset-0 overflow-hidden">
            <svg className="w-full h-full opacity-25" viewBox="0 0 400 128" preserveAspectRatio="none">
              <path
                d="M0,80 Q60,40 120,70 T240,50 T360,65 T400,40"
                fill="none"
                stroke="#4b8eff"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#131313] to-transparent" />
          <div className="relative z-10 px-4 pb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#79ff5b] shadow-[0_0_6px_#79ff5b]" />
            <span className="text-xs font-mono text-[#e5e2e1]/70">
              Marché BRVM · Données locales
            </span>
          </div>
        </div>

        {/* Existing positions hint */}
        {!isEdit && portfolio.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-mono text-[#8b90a0] uppercase tracking-wider px-1">
              Déjà dans le portefeuille
            </p>
            <div className="flex flex-wrap gap-2">
              {portfolio.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setName(s.name)}
                  className="px-3 py-1.5 bg-[#201f1f] border border-[#414755] rounded-lg text-xs font-mono text-[#adc6ff] active:scale-95 transition-transform"
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Submit button */}
      <div className="fixed bottom-0 w-full px-5 pb-8 pt-4 bg-gradient-to-t from-[#131313] via-[#131313]/95 to-transparent z-40">
        <button
          onClick={handleSubmit}
          disabled={!valid}
          className="w-full h-[52px] bg-[#4b8eff] text-white font-bold text-base rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-[#4b8eff]/20 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isEdit ? <Check size={20} /> : <Plus size={20} />}
          {isEdit ? "Enregistrer les modifications" : "Ajouter au portefeuille"}
        </button>
      </div>
    </div>
  );
}

export default function AddPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <AddStockForm />
    </Suspense>
  );
}
