interface StatCardProps {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: "gain" | "loss" | "neutral";
  size?: "sm" | "md";
}

export function StatCard({ label, value, mono, highlight, size = "md" }: StatCardProps) {
  const valueColor =
    highlight === "gain"
      ? "text-[#79ff5b]"
      : highlight === "loss"
      ? "text-[#ffb4ab]"
      : "text-[#e5e2e1]";

  const height = size === "sm" ? "h-24" : "h-28";

  return (
    <div className={`bg-[#201f1f] border border-[#414755]/40 rounded-xl p-4 flex flex-col justify-between ${height}`}>
      <span className="text-[10px] font-mono text-[#8b90a0] uppercase tracking-wider leading-none">
        {label}
      </span>
      <span
        className={`font-bold leading-tight ${valueColor} ${
          mono ? "font-mono text-sm" : "text-base"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
