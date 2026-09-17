"use client";

import { useState } from "react";
import Link from "next/link";
import AuthStatus from "./auth-status";
import NavIcon from "@/components/nav-icon";

type NavLink = {
  href: string;
  label: string;
  icon: Parameters<typeof NavIcon>[0]["name"];
};

export default function MobileNav({
  navLinks,
  loggedIn,
}: {
  navLinks: NavLink[];
  loggedIn: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        className="relative z-50 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-rule text-foreground transition-colors duration-200 hover:border-g-blue"
      >
        <span className="sr-only">メニューを開く</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          className="h-4 w-4 transition-transform duration-200"
          style={{ transform: open ? "rotate(90deg)" : "none" }}
          aria-hidden="true"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {/* タップで閉じる背景オーバーレイ（ヘッダー本体は覆わない） */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-30 bg-foreground/20 backdrop-blur-[1px] transition-opacity duration-200 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <nav
        id="mobile-nav-panel"
        aria-hidden={!open}
        className={`absolute inset-x-0 top-full z-40 origin-top rounded-b-2xl border-b border-rule bg-card p-3 shadow-xl transition-[opacity,transform] duration-200 ease-out ${
          open
            ? "pointer-events-auto translate-y-0 scale-y-100 opacity-100"
            : "pointer-events-none -translate-y-1 scale-y-95 opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-mono text-sm text-foreground-soft transition-colors duration-150 hover:bg-background hover:text-g-blue"
              >
                <NavIcon name={link.icon} />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex flex-col gap-1 border-t border-rule pt-2">
          <AuthStatus
            loggedIn={loggedIn}
            onNavigate={() => setOpen(false)}
            variant="rows"
          />
        </div>
      </nav>
    </div>
  );
}
