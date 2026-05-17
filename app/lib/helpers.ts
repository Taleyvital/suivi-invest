import type { Stock, PortfolioTotals } from "./types";

export const STORAGE_KEY = "brvm_portfolio_v1";

export const DEFAULT_PORTFOLIO: Stock[] = [
  { id: "1", name: "CIE",     quantity: 31, pma: 2159,  currentPrice: 2159  },
  { id: "2", name: "SODECI",  quantity: 14, pma: 5478,  currentPrice: 5478  },
  { id: "3", name: "SONATEL", quantity: 1,  pma: 25909, currentPrice: 25909 },
  { id: "4", name: "BOA-B",   quantity: 13, pma: 3802,  currentPrice: 3802  },
  { id: "5", name: "BOA-CI",  quantity: 10, pma: 6732,  currentPrice: 6732  },
  { id: "6", name: "NSIA",    quantity: 15, pma: 9906,  currentPrice: 9906  },
  { id: "7", name: "SGBCI",   quantity: 4,  pma: 28628, currentPrice: 28628 },
  { id: "8", name: "SIB",     quantity: 10, pma: 4592,  currentPrice: 4592  },
  { id: "9", name: "TOTALCI", quantity: 14, pma: 2857,  currentPrice: 2857  },
];

export function fmt(n: number): string {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n);
}

export function fmtPct(n: number): string {
  return (n >= 0 ? "+" : "") + n.toFixed(2) + "%";
}

export function tickerAbbr(name: string): string {
  const letters = name.replace(/[^A-Za-z]/g, "").toUpperCase();
  return letters.slice(0, 3) || name.slice(0, 3).toUpperCase();
}

export function calcTotals(portfolio: Stock[]): PortfolioTotals {
  const invested = portfolio.reduce((s, st) => s + st.quantity * st.pma, 0);
  const current  = portfolio.reduce((s, st) => s + st.quantity * st.currentPrice, 0);
  const gain     = current - invested;
  const pct      = invested > 0 ? (gain / invested) * 100 : 0;
  return { invested, current, gain, pct };
}

export function stockPct(stock: Stock): number {
  return stock.pma > 0 ? ((stock.currentPrice - stock.pma) / stock.pma) * 100 : 0;
}

type LogoEntry = { src: string; whiteBg?: boolean };

const LOGO_MAP: Record<string, LogoEntry> = {
  CIE:     { src: "/Logo/logo-cie.jpg" },
  SODECI:  { src: "/Logo/SODECI.png",  whiteBg: true },
  SONATEL: { src: "/Logo/SONATEL.jpeg", whiteBg: true },
  "BOA-B": { src: "/Logo/BOA-CI.png" },
  "BOA-CI":{ src: "/Logo/BOA-CI.png" },
  NSIA:    { src: "/Logo/NSIA.png" },
  SGBCI:   { src: "/Logo/SGBCI.png" },
  SIB:     { src: "/Logo/SIB.png" },
  TOTALCI: { src: "/Logo/TOTAL.jpeg", whiteBg: true },
};

export function getStockLogo(name: string): LogoEntry | null {
  return LOGO_MAP[name.toUpperCase()] ?? null;
}

export function chartPath(name: string, positive: boolean): string {
  let seed = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const w = 400;
  const points: [number, number][] = [];

  for (let i = 0; i <= 8; i++) {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    const x = (i / 8) * w;
    const y = 30 + ((seed >>> 0) % 90);
    points.push([x, y]);
  }

  if (positive) {
    points[points.length - 1][1] = Math.max(15, points[0][1] - 25);
  } else {
    points[points.length - 1][1] = Math.min(120, points[0][1] + 25);
  }

  return points
    .map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`))
    .join(" ");
}
