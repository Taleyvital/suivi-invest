"use client";

import { PortfolioProvider } from "./lib/context";

export function Providers({ children }: { children: React.ReactNode }) {
  return <PortfolioProvider>{children}</PortfolioProvider>;
}
