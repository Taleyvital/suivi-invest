import Image from "next/image";
import { getStockLogo, tickerAbbr } from "@/app/lib/helpers";

interface StockAvatarProps {
  name: string;
  /** Side length in px — defaults to 40 */
  size?: number;
  className?: string;
}

export function StockAvatar({ name, size = 40, className = "" }: StockAvatarProps) {
  const logo = getStockLogo(name);
  const fontSize = size <= 32 ? "9px" : size <= 40 ? "11px" : "13px";

  if (logo) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`relative rounded-xl overflow-hidden shrink-0 ${
          logo.whiteBg ? "bg-white p-[3px]" : ""
        } ${className}`}
      >
        <Image
          src={logo.src}
          alt={name}
          fill
          sizes={`${size}px`}
          className={logo.whiteBg ? "object-contain" : "object-cover"}
          priority={false}
        />
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size, fontSize }}
      className={`rounded-xl bg-[#353534] flex items-center justify-center font-bold text-[#adc6ff] shrink-0 ${className}`}
    >
      {tickerAbbr(name)}
    </div>
  );
}
