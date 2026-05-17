"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { Stock } from "./types";
import { DEFAULT_PORTFOLIO, STORAGE_KEY } from "./helpers";

type PortfolioCtx = {
  portfolio: Stock[];
  hydrated: boolean;
  addStock: (data: Omit<Stock, "id">) => void;
  updateStock: (id: string, data: Partial<Omit<Stock, "id">>) => void;
  deleteStock: (id: string) => void;
  updatePrice: (id: string, price: number) => void;
  clearPortfolio: () => void;
  getStock: (id: string) => Stock | undefined;
};

const PortfolioContext = createContext<PortfolioCtx | null>(null);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [portfolio, setPortfolio] = useState<Stock[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setPortfolio(raw ? JSON.parse(raw) : DEFAULT_PORTFOLIO);
    } catch {
      setPortfolio(DEFAULT_PORTFOLIO);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
  }, [portfolio, hydrated]);

  const addStock = useCallback((data: Omit<Stock, "id">) => {
    setPortfolio((prev) => [
      ...prev,
      { ...data, id: Date.now().toString() },
    ]);
  }, []);

  const updateStock = useCallback(
    (id: string, data: Partial<Omit<Stock, "id">>) => {
      setPortfolio((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...data } : s))
      );
    },
    []
  );

  const deleteStock = useCallback((id: string) => {
    setPortfolio((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const updatePrice = useCallback((id: string, price: number) => {
    setPortfolio((prev) =>
      prev.map((s) => (s.id === id ? { ...s, currentPrice: price } : s))
    );
  }, []);

  const clearPortfolio = useCallback(() => {
    setPortfolio(DEFAULT_PORTFOLIO);
  }, []);

  const getStock = useCallback(
    (id: string) => portfolio.find((s) => s.id === id),
    [portfolio]
  );

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        hydrated,
        addStock,
        updateStock,
        deleteStock,
        updatePrice,
        clearPortfolio,
        getStock,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be inside PortfolioProvider");
  return ctx;
}
