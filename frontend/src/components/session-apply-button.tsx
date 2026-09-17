"use client";

import { useState } from "react";
import Link from "next/link";
import PostSubmitNav from "@/components/post-submit-nav";
import { createClient } from "@/lib/supabase/client";

export default function SessionApplyButton({
  userId,
  showHackathonCta = false,
}: {
  userId: string;
  showHackathonCta?: boolean;
}) {
  const [applied, setApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (applied) {
    return (
      <div role="status" className="animate-fade-in-up rounded-2xl border border-rule bg-card p-8">
        <p className="text-center font-display text-xl font-extrabold text-g-green">
          第一部への参加申込みを受け付けました
        </p>
        <p className="mt-3 text-center text-sm text-foreground-soft">
          抽選結果はマイページでご確認いただけます。
        </p>

        {showHackathonCta ? (
          <div className="mt-6 rounded-xl border border-rule bg-white p-5">
            <p className="text-sm font-bold">
              北陸地域のご所属なので、第二部（ハッカソン）にもお申し込みいただけます
            </p>
            <p className="mt-1 text-sm text-foreground-soft">
              第一部・第二部の両方へ参加する場合は、続けて第二部へもお申し込みください。
            </p>
            <Link
              href="/register/hackathon"
              className="mt-4 inline-block rounded-full bg-g-blue px-5 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-[#1a56c4]"
            >
              第二部（ハッカソン）に申し込む
            </Link>
          </div>
        ) : null}
        <PostSubmitNav />
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        disabled={submitting}
        onClick={async () => {
          setSubmitting(true);
          setError(null);
          const supabase = createClient();
          const { error: insertError } = await supabase
            .from("session_applications")
            .insert({ user_id: userId });
          setSubmitting(false);
          if (insertError) {
            setError("申込みに失敗しました。時間をおいて再度お試しください。");
            return;
          }
          setApplied(true);
        }}
        className="w-full rounded-full bg-g-blue px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1a56c4] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {submitting ? "送信中..." : "第一部への参加を申し込む"}
      </button>
      {error ? (
        <p role="alert" className="mt-2 text-sm text-g-red">
          {error}
        </p>
      ) : null}
    </div>
  );
}
