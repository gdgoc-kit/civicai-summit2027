import Image from "next/image";
import Link from "next/link";

export default function SiteBrand() {
  return (
    <Link
      href="/"
      className="relative z-40 flex shrink-0 flex-col items-center"
    >
      <Image
        src="/gdgoc-kit-logo.png"
        alt="GDGoC KIT"
        width={1920}
        height={390}
        className="h-6 w-auto shrink-0 rounded-none sm:h-7"
        priority
      />
      <span className="font-display text-[10px] font-extrabold tracking-tight sm:text-xs">
        CivicAI Summit <span className="text-g-blue">2027</span>
      </span>
    </Link>
  );
}
