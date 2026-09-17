"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function StudentPriorityCapacityPanel({
  currentCount,
  initialCapacity,
}: {
  currentCount: number;
  initialCapacity: number;
}) {
  const router = useRouter();
  const [capacity, setCapacity] = useState(String(initialCapacity));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSave = async () => {
    const value = Number(capacity);
    if (!Number.isInteger(value) || value < 0) {
      setError("0以上の整数を入力してください。");
      return;
    }
    setSaving(true);
    setError(null);
    setSaved(false);
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("app_settings")
      .update({ student_priority_capacity: value })
      .eq("id", 1);
    setSaving(false);
    if (updateError) {
      setError("保存に失敗しました。時間をおいて再度お試しください。");
      return;
    }
    setSaved(true);
    router.refresh();
  };

  const isFull = currentCount >= initialCapacity;

  return (
    <div className="rounded-2xl border border-rule bg-card p-6">
      <div className="flex items-center justify-between">
        <p className="font-display font-bold">第二部 学生優先枠の定員</p>
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
            isFull
              ? "bg-g-red/10 text-g-red"
              : "bg-g-green/10 text-g-green"
          }`}
        >
          {currentCount} / {initialCapacity} 件
          {isFull ? "（定員到達）" : ""}
        </span>
      </div>
      <p className="mt-2 text-sm text-foreground-soft">
        定員に達すると、学生優先枠での新規応募は自動的に受け付けなくなります（学生・社会人枠への応募は引き続き可能です）。応募のキャンセルがあれば、その分だけ再度受け付けられるようになります。
      </p>

      <div className="mt-4 flex items-end gap-4">
        <div>
          <label className="text-xs font-bold text-foreground-soft">
            定員
          </label>
          <input
            type="number"
            min={0}
            value={capacity}
            onChange={(e) => {
              setCapacity(e.target.value);
              setSaved(false);
            }}
            className="mt-1 w-32 rounded-lg border border-rule bg-white px-3 py-2 text-sm outline-none focus:border-g-blue"
          />
        </div>
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
