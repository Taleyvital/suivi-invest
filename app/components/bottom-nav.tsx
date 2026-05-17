"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, Wallet, Plus, Bell } from "lucide-react";

const tabs = [
  { href: "/market",   icon: BarChart2, label: "Marché"  },
  { href: "/",         icon: Wallet,    label: "Assets"  },
  { href: "/add",      icon: Plus,      label: "Trade"   },
  { href: "/alerts",   icon: Bell,      label: "Alertes" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full z-40 flex justify-around items-center px-2 pb-safe h-[72px] glass-nav border-t border-[#414755]/30">
      {tabs.map(({ href, icon: Icon, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-full transition-all active:scale-90 ${
              active ? "text-[#d8e2ff]" : "text-[#8b90a0]"
            }`}
          >
            <Icon size={22} strokeWidth={active ? 2 : 1.5} />
            <span className="text-[10px] font-mono">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
