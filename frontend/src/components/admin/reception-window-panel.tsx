"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function toDatetimeLocalValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function ReceptionWindowPanel({
  title,
  description,
  startsAtField,
  endsAtField,
  initialStartsAt,
  initialEndsAt,
}: {
  title: string;
  description: string;
  startsAtField: string;
  endsAtField: string;
  initialStartsAt: string | null;
  initialEndsAt: string | null;
}) {
  const router = useRouter();
  const [startsAt, setStartsAt] = useState(
    toDatetimeLocalValue(initialStartsAt),
  );
  const [endsAt, setEndsAt] = useState(toDatetimeLocalValue(initialEndsAt));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("app_settings")
      .update({
        [startsAtField]: startsAt ? new Date(startsAt).toISOString() : null,
        [endsAtField]: endsAt ? new Date(endsAt).toISOString() : null,
      })
      .eq("id", 1);
    setSaving(false);
    if (updateError) {
      setError("保存に失敗しました。時間をおいて再度お試しください。");
      return;
    }
    setSaved(true);
    router.refresh();
  };

  return (
    <div className="rounded-2xl border border-rule bg-card p-6">
      <p className="font-display font-bold">{title}</p>
      <p className="mt-2 text-sm text-foreground-soft">{description}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-bold text-foreground-soft">
            受付開始日時
          </label>
          <input
            type="datetime-local"
            value={startsAt}
            onChange={(e) => {
              setStartsAt(e.target.value);
              setSaved(false);
            }}
            className="mt-1 w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm outline-none focus:border-g-blue"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-foreground-soft">
            受付終了日時
          </label>
          <input
            type="datetime-local"
            value={endsAt}
            onChange={(e) => {
              setEndsAt(e.target.value);
              setSaved(false);
            }}
            className="mt-1 w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm outline-none focus:border-g-blue"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="rounded-full bg-g-blue px-5 py-2.5 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#1a56c4] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "保存中..." : "保存する"}
        </button>
        {saved ? (
          <span className="text-sm font-bold text-g-green">保存しました</span>
        ) : null}
        {error ? <span className="text-sm text-g-red">{error}</span> : null}
      </div>
    </div>
  );
}
