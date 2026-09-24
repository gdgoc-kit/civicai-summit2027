import Link from "next/link";
import MobileNav from "./mobile-nav";
import AuthStatus from "./auth-status";
import SiteBrand from "./site-brand";
import { createClient } from "@/lib/supabase/server";
import { getReceptionStatus } from "@/lib/reception-window";

const navLinks = [
  { href: "/about", label: "概要", icon: "about" as const },
  { href: "/program", label: "プログラム", icon: "program" as const },
  { href: "/tracks", label: "募集テーマ", icon: "tracks" as const },
  { href: "/venue", label: "会場", icon: "venue" as const },
  { href: "/sponsors", label: "協賛", icon: "sponsors" as const },
  { href: "/faq", label: "よくある質問", icon: "faq" as const },
];

export default async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const loggedIn = !!user;

  const { data: appSettings } = await supabase
    .from("app_settings")
    .select("reception_starts_at, reception_ends_at")
    .eq("id", 1)
    .maybeSingle();
  const registrationStatus = getReceptionStatus(
    appSettings?.reception_starts_at ?? null,
    appSettings?.reception_ends_at ?? null,
  );
  const registerCtaLabel =
    registrationStatus === "before" ? "事前登録" : "参加登録";

  return (
    <header className="relative border-b border-rule bg-card">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-4">
        <SiteBrand />

        <nav className="relative z-40 hidden flex-1 flex-wrap items-center gap-5 text-sm text-foreground-soft lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[13px] transition-colors duration-200 hover:text-g-blue"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="relative z-40 hidden items-center gap-4 lg:flex">
          <AuthStatus loggedIn={loggedIn} />
        </div>

        <span
          aria-disabled="true"
          className="relative z-40 ml-auto shrink-0 cursor-not-allowed rounded-full bg-gray-500 px-5 py-2 text-sm font-bold text-white lg:ml-0"
        >
          {registerCtaLabel}
        </span>

        <MobileNav navLinks={navLinks} loggedIn={loggedIn} />
      </div>
    </header>
  );
}
