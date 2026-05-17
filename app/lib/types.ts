export type Stock = {
  id: string;
  name: string;
  quantity: number;
  pma: number;
  currentPrice: number;
};

export type PortfolioTotals = {
  invested: number;
  current: number;
  gain: number;
  pct: number;
};
