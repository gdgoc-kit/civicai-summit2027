"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const lotteryOptions = [
  { value: "pending", label: "抽選待ち" },
  { value: "won", label: "当選" },
  { value: "lost", label: "落選" },
];

export default function SessionResultRow({
  userId,
  name,
  nickname,
  initialResult,
}: {
  userId: string;
  name: string;
  nickname: string;
  initialResult: string;
}) {
  const [result, setResult] = useState(initialResult);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("session_applications")
      .update({ lottery_result: result })
      .eq("user_id", userId);
    setSaving(false);
    if (updateError) {
      setError("保存に失敗しました");
      return;
    }
    setSaved(true);
  };

  return (
    <tr className="border-b border-rule last:border-0">
      <td className="whitespace-nowrap py-3 pr-4 text-sm font-bold">
        {name}
      </td>
      <td className="whitespace-nowrap py-3 pr-4 text-sm text-foreground-soft">
        {nickname}
      </td>
      <td className="py-3 pr-4">
        <select
          value={result}
          onChange={(e) => {
            setResult(e.target.value);
            setSaved(false);
          }}
          className="rounded-lg border border-rule bg-white px-3 py-1.5 text-sm outline-none focus:border-g-blue"
        >
          {lotteryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </td>
      <td className="whitespace-nowrap py-3">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="rounded-full bg-g-blue px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#1a56c4] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "保存中..." : "保存"}
        </button>
        {saved ? (
          <span className="ml-2 text-xs font-bold text-g-green">保存済み</span>
        ) : null}
        {error ? (
          <span className="ml-2 text-xs font-bold text-g-red">{error}</span>
        ) : null}
      </td>
    </tr>
  );
}
