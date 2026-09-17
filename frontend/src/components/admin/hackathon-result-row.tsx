"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { trackOptions } from "@/lib/hackathon-application-schema";

const lotteryOptions = [
  { value: "pending", label: "抽選待ち" },
  { value: "won", label: "当選" },
  { value: "lost", label: "落選" },
];

const quotaLabel: Record<string, string> = {
  studentPriority: "学生優先枠",
  studentGeneral: "学生・社会人枠",
};

const trackLabel: Record<string, string> = Object.fromEntries(
  trackOptions.map((t) => [t.value, t.label]),
);

export default function HackathonResultRow({
  userId,
  name,
  nickname,
  quota,
  trackPrimary,
  trackSecondary,
  initialLotteryResult,
  initialAssignedTrack,
  initialTeamNumber,
}: {
  userId: string;
  name: string;
  nickname: string;
  quota: string;
  trackPrimary: string;
  trackSecondary: string;
  initialLotteryResult: string;
  initialAssignedTrack: string | null;
  initialTeamNumber: string | null;
}) {
  const [lotteryResult, setLotteryResult] = useState(initialLotteryResult);
  const [assignedTrack, setAssignedTrack] = useState(initialAssignedTrack ?? "");
  const [teamNumber, setTeamNumber] = useState(initialTeamNumber ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("hackathon_applications")
      .update({
        lottery_result: lotteryResult,
        assigned_track: assignedTrack || null,
        team_number: teamNumber.trim() || null,
      })
      .eq("user_id", userId);
    setSaving(false);
    if (updateError) {
      setError("保存に失敗しました");
      return;
    }
    setSaved(true);
  };

  return (
    <tr className="border-b border-rule last:border-0 align-top">
      <td className="whitespace-nowrap py-3 pr-4 text-sm font-bold">
        {name}
        <p className="font-normal text-xs text-foreground-soft">{nickname}</p>
      </td>
      <td className="whitespace-nowrap py-3 pr-4 text-sm text-foreground-soft">
        {quotaLabel[quota] ?? quota}
      </td>
      <td className="whitespace-nowrap py-3 pr-4 text-xs text-foreground-soft">
        {trackLabel[trackPrimary] ?? trackPrimary}
        <br />
        {trackLabel[trackSecondary] ?? trackSecondary}
      </td>
      <td className="py-3 pr-4">
        <select
          value={lotteryResult}
          onChange={(e) => {
            setLotteryResult(e.target.value);
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
      <td className="py-3 pr-4">
        <select
          value={assignedTrack}
          onChange={(e) => {
            setAssignedTrack(e.target.value);
            setSaved(false);
          }}
          className="rounded-lg border border-rule bg-white px-3 py-1.5 text-sm outline-none focus:border-g-blue"
        >
          <option value="">未確定</option>
          {trackOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </td>
      <td className="py-3 pr-4">
        <input
          type="text"
          value={teamNumber}
          onChange={(e) => {
            setTeamNumber(e.target.value);
            setSaved(false);
          }}
          placeholder="例: Team 12"
          className="w-28 rounded-lg border border-rule bg-white px-3 py-1.5 text-sm outline-none focus:border-g-blue"
        />
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
