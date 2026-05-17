import { fmtPct } from "@/app/lib/helpers";

interface GainBadgeProps {
  value: number;
  className?: string;
  pill?: boolean;
}

export function GainBadge({ value, className = "", pill }: GainBadgeProps) {
  const positive = value >= 0;
  const color = positive ? "text-[#79ff5b]" : "text-[#ffb4ab]";

  if (pill) {
    return (
      <span
        className={`border rounded-full px-3 py-1 text-xs font-mono font-semibold ${
          positive
            ? "border-[#79ff5b]/30 bg-[#79ff5b]/10 text-[#79ff5b]"
            : "border-[#ffb4ab]/30 bg-[#ffb4ab]/10 text-[#ffb4ab]"
        } ${className}`}
      >
        {fmtPct(value)}
      </span>
    );
  }

  return (
    <span className={`text-xs font-mono font-medium ${color} ${className}`}>
      {fmtPct(value)}
    </span>
  );
}
