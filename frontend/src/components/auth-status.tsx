"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import NavIcon from "@/components/nav-icon";
import { queueToast } from "@/lib/toast";

export default function AuthStatus({
  loggedIn,
  onNavigate,
  variant = "inline",
}: {
  loggedIn: boolean;
  onNavigate?: () => void;
  variant?: "inline" | "rows";
}) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    queueToast("ログアウトしました");
    onNavigate?.();
    router.push("/");
    router.refresh();
  };

  const inlineClassName =
    "font-mono text-[13px] text-foreground-soft transition-colors duration-200 hover:text-g-blue";
  const rowClassName =
    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left font-mono text-sm text-foreground-soft transition-colors duration-150 hover:bg-background hover:text-g-blue";

  if (!loggedIn) {
    if (variant === "rows") {
      return (
        <Link href="/login" onClick={onNavigate} className={rowClassName}>
          <NavIcon name="user" />
          ログイン
        </Link>
      );
    }
    return (
      <Link href="/login" onClick={onNavigate} className={inlineClassName}>
        ログイン
      </Link>
    );
  }

  if (variant === "rows") {
    return (
      <>
        <Link href="/mypage" onClick={onNavigate} className={rowClassName}>
          <NavIcon name="user" />
          マイページ
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className={`${rowClassName} hover:bg-g-red/10 hover:text-g-red`}
        >
          <NavIcon name="logout" />
          ログアウト
        </button>
      </>
    );
  }

  return (
    <>
      <Link href="/mypage" onClick={onNavigate} className={inlineClassName}>
        マイページ
      </Link>
      <button
        type="button"
        onClick={handleSignOut}
        className={inlineClassName}
      >
        ログアウト
      </button>
    </>
  );
}
