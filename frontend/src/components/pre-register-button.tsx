"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function PreRegisterButton({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) {
  const [registered, setRegistered] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (registered) {
    return (
      <div
        role="status"
        className="animate-fade-in-up rounded-2xl border border-rule bg-card p-8 text-center"
      >
        <p className="font-display text-lg font-extrabold text-g-green">
          事前登録を受け付けました
        </p>
        <p className="mt-2 text-sm text-foreground-soft">
          申込み開始時に、kit@gdgoc.jp より {email} 宛にご連絡します。
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-rule bg-card p-6 text-center">
      <p className="text-sm text-foreground-soft">
        事前登録いただくと、申込み開始時に kit@gdgoc.jp より {email} 宛へご連絡します。
      </p>
      <button
        type="button"
        disabled={submitting}
        onClick={async () => {
          setSubmitting(true);
          setError(null);
          const supabase = createClient();
          const { error: upsertError } = await supabase
            .from("pre_registrations")
            .upsert({ user_id: userId, email }, { onConflict: "user_id" });
          setSubmitting(false);
          if (upsertError) {
            setError("事前登録に失敗しました。時間をおいて再度お試しください。");
            return;
          }
          setRegistered(true);
        }}
        className="mt-4 w-full rounded-full bg-g-blue px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1a56c4] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {submitting ? "送信中..." : "事前登録する"}
      </button>
      {error ? (
        <p role="alert" className="mt-2 text-sm text-g-red">
          {error}
        </p>
      ) : null}
    </div>
  );
}
