"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  runSessionLottery,
  runHackathonLottery,
  assignTeams,
  type HackathonApplicant,
  type TeamAssignment,
} from "@/lib/lottery";

export type LotteryCompletePayload = {
  sessionResults: Map<string, "won" | "lost">;
  hackathonResults: Map<string, "won" | "lost">;
  teamAssignments: Map<string, TeamAssignment>;
};

export default function LotteryPanel({
  resultsConfirmed,
  initialStudentPriorityCapacity = 105,
  onResultsConfirmedChange,
  onLotteryComplete,
}: {
  resultsConfirmed: boolean;
  initialStudentPriorityCapacity?: number;
  onResultsConfirmedChange?: (value: boolean) => void;
  onLotteryComplete?: (payload: LotteryCompletePayload) => void;
}) {
  const router = useRouter();
  const [sessionCapacity, setSessionCapacity] = useState("");
  const [studentPriorityCapacity, setStudentPriorityCapacity] = useState(
    String(initialStudentPriorityCapacity),
  );
  const [studentGeneralCapacity, setStudentGeneralCapacity] = useState("45");
  const [running, setRunning] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runLottery = async () => {
    const sessionCap = Number(sessionCapacity);
    const priorityCap = Number(studentPriorityCapacity);
    const generalCap = Number(studentGeneralCapacity);
    if (!sessionCap || !priorityCap || !generalCap) {
      setError("すべての定員を数値で入力してください。");
      return;
    }

    setRunning(true);
    setError(null);
    setMessage(null);
    const supabase = createClient();

    try {
      // 再計算中は一旦非公開に戻す
      await supabase
        .from("app_settings")
        .update({ results_confirmed: false })
        .eq("id", 1);
      onResultsConfirmedChange?.(false);

      const [
        { data: sessionApps, error: sessionError },
        { data: hackathonApps, error: hackathonError },
        { data: registrations, error: registrationError },
      ] = await Promise.all([
        supabase.from("session_applications").select("user_id"),
        supabase
          .from("hackathon_applications")
          .select(
            "user_id, quota, track_primary, track_secondary, experience_level, teammate_request, applied_at",
          ),
        supabase.from("registrations").select("user_id, nickname"),
      ]);

      if (sessionError || hackathonError || registrationError) {
        throw sessionError ?? hackathonError ?? registrationError;
      }

      const nicknameByUserId = new Map(
        (registrations ?? []).map((r) => [r.user_id, r.nickname]),
      );

      // --- 第一部：抽選 ---
      const sessionResults = runSessionLottery(
        (sessionApps ?? []).map((a) => ({ userId: a.user_id })),
        sessionCap,
      );
      await Promise.all(
        Array.from(sessionResults.entries()).map(([userId, lotteryResult]) =>
          supabase
            .from("session_applications")
            .update({ lottery_result: lotteryResult })
            .eq("user_id", userId),
        ),
      );
      // 第二部のチーム編成は、この実行で確定した第一部の当落を基準にする
      const attendedDay1ByUserId = new Set(
        Array.from(sessionResults.entries())
          .filter(([, result]) => result === "won")
          .map(([userId]) => userId),
      );

      // --- 第二部：抽選 ---
      const hackathonApplicants: HackathonApplicant[] = (
        hackathonApps ?? []
      ).map((a) => ({
        userId: a.user_id,
        nickname: nicknameByUserId.get(a.user_id) ?? "",
        quota: a.quota,
        trackPrimary: a.track_primary,
        trackSecondary: a.track_secondary,
        experienceLevel: a.experience_level,
        teammateRequest: a.teammate_request,
        appliedAt: a.applied_at,
        attendedDay1: attendedDay1ByUserId.has(a.user_id),
      }));

      const hackathonResults = runHackathonLottery(
        hackathonApplicants,
        priorityCap,
        generalCap,
      );

      const winners = hackathonApplicants.filter(
        (a) => hackathonResults.get(a.userId) === "won",
      );
      const teamAssignments = assignTeams(winners);

      await Promise.all(
        hackathonApplicants.map((a) => {
          const lotteryResult = hackathonResults.get(a.userId) ?? "pending";
          const team = teamAssignments.get(a.userId);
          return supabase
            .from("hackathon_applications")
            .update({
              lottery_result: lotteryResult,
              assigned_track: team?.assignedTrack ?? null,
              team_number: team?.teamNumber ?? null,
            })
            .eq("user_id", a.userId);
        }),
      );

      setMessage(
        `実行しました（第一部 ${sessionApps?.length ?? 0}件、第二部 ${
          hackathonApps?.length ?? 0
        }件のうち当選 ${winners.length}件・${
          new Set(Array.from(teamAssignments.values()).map((t) => t.teamNumber))
            .size
        }チーム編成）。下書き状態です。内容を確認して「公開する」を押してください。`,
      );
      onLotteryComplete?.({ sessionResults, hackathonResults, teamAssignments });
      router.refresh();
    } catch {
      setError("実行中にエラーが発生しました。時間をおいて再度お試しください。");
    } finally {
      setRunning(false);
    }
  };

  const setPublish = async (value: boolean) => {
    setPublishing(true);
    setError(null);
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("app_settings")
      .update({ results_confirmed: value })
      .eq("id", 1);
    setPublishing(false);
    if (updateError) {
      setError("更新に失敗しました。時間をおいて再度お試しください。");
      return;
    }
    onResultsConfirmedChange?.(value);
    router.refresh();
  };

  return (
    <div className="rounded-2xl border border-rule bg-card p-6">
      <div className="flex items-center justify-between">
        <p className="font-display font-bold">抽選・チーム編成の自動実行</p>
        <span className="flex items-center gap-2">
          {running ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-g-blue/10 px-3 py-1 text-xs font-bold text-g-blue">
              <span
                aria-hidden="true"
                className="h-3 w-3 animate-spin rounded-full border-2 border-g-blue border-t-transparent"
              />
              実行中...
            </span>
          ) : null}
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
              resultsConfirmed
                ? "bg-g-green/10 text-g-green"
                : "bg-rule text-foreground-soft"
            }`}
          >
            {resultsConfirmed ? "公開済み" : "下書き（未公開）"}
          </span>
        </span>
      </div>
      <p className="mt-2 text-sm text-foreground-soft">
        実行すると、下の一覧表の抽選結果・トラック・チーム番号が自動で上書きされます。この時点ではまだ参加者のマイページには反映されません。内容を確認し、問題なければ「参加者に公開する」を押してください（個別の結果は下の一覧表から手動でも修正できます）。
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <label className="text-xs font-bold text-foreground-soft">
            第一部 定員（抽選）
          </label>
          <input
            type="number"
            min={0}
            value={sessionCapacity}
            onChange={(e) => setSessionCapacity(e.target.value)}
            placeholder="未定"
            className="mt-1 w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm outline-none focus:border-g-blue"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-foreground-soft">
            第二部 学生優先枠（先着順）
          </label>
          <input
            type="number"
            min={0}
            value={studentPriorityCapacity}
            onChange={(e) => setStudentPriorityCapacity(e.target.value)}
            className="mt-1 w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm outline-none focus:border-g-blue"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-foreground-soft">
            第二部 学生・社会人枠（抽選）
          </label>
          <input
            type="number"
            min={0}
            value={studentGeneralCapacity}
            onChange={(e) => setStudentGeneralCapacity(e.target.value)}
            className="mt-1 w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm outline-none focus:border-g-blue"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={runLottery}
          disabled={running}
          className="rounded-full bg-g-blue px-5 py-2.5 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#1a56c4] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {running ? "実行中..." : "自動実行する（下書き）"}
        </button>
        {resultsConfirmed ? (
          <button
            type="button"
            onClick={() => setPublish(false)}
            disabled={publishing || running}
            className="rounded-full border border-g-red px-5 py-2.5 text-sm font-bold text-g-red transition-colors duration-200 hover:bg-g-red/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {publishing ? "処理中..." : "公開を取り消す"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setPublish(true)}
            disabled={publishing || running}
            className="rounded-full border border-g-green px-5 py-2.5 text-sm font-bold text-g-green transition-colors duration-200 hover:bg-g-green/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {publishing ? "処理中..." : "参加者に公開する"}
          </button>
        )}
      </div>

      {message ? (
        <p className="mt-3 text-sm text-g-green">{message}</p>
      ) : null}
      {error ? <p className="mt-3 text-sm text-g-red">{error}</p> : null}
    </div>
  );
}
