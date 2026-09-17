"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        className="fill-g-blue"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81Z"
      />
      <path
        className="fill-g-green"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.92l-3.88-3c-1.08.73-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A12 12 0 0 0 12 24Z"
      />
      <path
        className="fill-g-yellow"
        d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54V6.62H1.27a12 12 0 0 0 0 10.76l4-3.11Z"
      />
      <path
        className="fill-g-red"
        d="M12 4.75c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.62l4 3.11C6.22 6.87 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

export default function GoogleLoginButton({ next = "/mypage" }: { next?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (oauthError) {
      setLoading(false);
      setError("ログインに失敗しました。時間をおいて再度お試しください。");
    }
    // 成功時は Google の認証画面へリダイレクトされるため、以降の処理は不要
  };

  return (
    <div className="rounded-2xl border border-rule bg-card p-8 text-center">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-rule bg-white px-6 py-3 text-sm font-bold text-foreground transition-colors duration-200 hover:border-g-blue disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        <GoogleGlyph />
        {loading ? "リダイレクト中..." : "Googleでログイン"}
      </button>
      {error ? (
        <p role="alert" className="mt-3 text-sm text-g-red">
          {error}
        </p>
      ) : null}
    </div>
  );
}
