"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  actions?: React.ReactNode;
  onBack?: () => void;
}

export function PageHeader({ title, actions, onBack }: PageHeaderProps) {
  const router = useRouter();

  return (
    <header className="fixed top-0 w-full z-50 flex items-center justify-between px-5 h-[56px] glass-header border-b border-[#414755]/30">
      <button
        onClick={onBack ?? (() => router.back())}
        className="w-10 h-10 flex items-center justify-center text-[#e5e2e1] active:scale-90 transition-transform"
      >
        <ArrowLeft size={22} />
      </button>
      <h1 className="text-base font-bold text-[#e5e2e1]">{title}</h1>
      <div className="flex items-center">{actions ?? <div className="w-10" />}</div>
    </header>
  );
}
