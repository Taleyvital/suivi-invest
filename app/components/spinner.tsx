import Image from "next/image";

export function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 min-h-dvh bg-[#131313]">
      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-white shadow-lg shadow-[#4b8eff]/20">
        <Image
          src="/Logo/logo-suivi-invest.png"
          alt="Suivi Invest"
          fill
          className="object-contain p-1"
          priority
        />
      </div>
      <div className="w-6 h-6 border-2 border-[#4b8eff] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
