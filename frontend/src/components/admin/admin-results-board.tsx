"use client";

import { useState } from "react";
import LotteryPanel, { type LotteryCompletePayload } from "@/components/admin/lottery-panel";
import SessionResultRow from "@/components/admin/session-result-row";
import HackathonResultRow from "@/components/admin/hackathon-result-row";

type SessionApplication = {
  user_id: string;
  lottery_result: string;
};

type HackathonApplication = {
  user_id: string;
  quota: string;
  track_primary: string;
  track_secondary: string;
  lottery_result: string;
  assigned_track: string | null;
  team_number: string | null;
};

type RegistrationInfo = {
  name: string;
  nickname: string;
  nicknameReading: string | null;
};

function formatNickname(reg: RegistrationInfo | undefined): string {
  if (!reg) return "-";
  return reg.nicknameReading
    ? `${reg.nickname}（${reg.nicknameReading}）`
    : reg.nickname;
}

export default function AdminResultsBoard({
  registrations,
  initialSessionApplications,
  initialHackathonApplications,
  initialResultsConfirmed,
  initialStudentPriorityCapacity,
}: {
  registrations: Record<string, RegistrationInfo>;
  initialSessionApplications: SessionApplication[];
  initialHackathonApplications: HackathonApplication[];
  initialResultsConfirmed: boolean;
  initialStudentPriorityCapacity: number;
}) {
  const [sessionApps, setSessionApps] = useState(initialSessionApplications);
  const [hackathonApps, setHackathonApps] = useState(
    initialHackathonApplications,
  );
  const [resultsConfirmed, setResultsConfirmed] = useState(
    initialResultsConfirmed,
  );

  const handleLotteryComplete = ({
    sessionResults,
    hackathonResults,
    teamAssignments,
  }: LotteryCompletePayload) => {
    setSessionApps((prev) =>
      prev.map((a) => ({
        ...a,
        lottery_result: sessionResults.get(a.user_id) ?? a.lottery_result,
      })),
    );
    setHackathonApps((prev) =>
      prev.map((a) => {
        const team = teamAssignments.get(a.user_id);
        return {
          ...a,
          lottery_result: hackathonResults.get(a.user_id) ?? a.lottery_result,
          assigned_track: team?.assignedTrack ?? null,
          team_number: team?.teamNumber ?? null,
        };
      }),
    );
  };

  return (
    <>
      <div className="mt-6 space-y-6">
        <LotteryPanel
          resultsConfirmed={resultsConfirmed}
          initialStudentPriorityCapacity={initialStudentPriorityCapacity}
          onResultsConfirmedChange={setResultsConfirmed}
          onLotteryComplete={handleLotteryComplete}
        />
      </div>

      <section className="mt-10">
        <h2 className="font-display text-lg font-bold">第一部（セッション）応募一覧</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-rule bg-card p-4">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-rule text-xs text-foreground-soft">
                <th className="py-2 pr-4 font-normal">氏名</th>
                <th className="py-2 pr-4 font-normal">ニックネーム</th>
                <th className="py-2 pr-4 font-normal">抽選結果</th>
                <th className="py-2 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {sessionApps.map((a) => {
                const reg = registrations[a.user_id];
                return (
                  <SessionResultRow
                    key={`${a.user_id}:${a.lottery_result}`}
                    userId={a.user_id}
                    name={reg?.name ?? "(不明)"}
                    nickname={formatNickname(reg)}
                    initialResult={a.lottery_result}
                  />
                );
              })}
            </tbody>
          </table>
          {sessionApps.length === 0 ? (
            <p className="py-4 text-center text-sm text-foreground-soft">
              応募はまだありません。
            </p>
          ) : null}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-lg font-bold">第二部（ハッカソン）応募一覧</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-rule bg-card p-4">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b border-rule text-xs text-foreground-soft">
                <th className="py-2 pr-4 font-normal">氏名 / ニックネーム</th>
                <th className="py-2 pr-4 font-normal">申込み枠</th>
                <th className="py-2 pr-4 font-normal">希望トラック</th>
                <th className="py-2 pr-4 font-normal">抽選結果</th>
                <th className="py-2 pr-4 font-normal">割当トラック</th>
                <th className="py-2 pr-4 font-normal">チーム番号</th>
                <th className="py-2 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {hackathonApps.map((a) => {
                const reg = registrations[a.user_id];
                return (
                  <HackathonResultRow
                    key={`${a.user_id}:${a.lottery_result}:${a.assigned_track}:${a.team_number}`}
                    userId={a.user_id}
                    name={reg?.name ?? "(不明)"}
                    nickname={formatNickname(reg)}
                    quota={a.quota}
                    trackPrimary={a.track_primary}
                    trackSecondary={a.track_secondary}
                    initialLotteryResult={a.lottery_result}
                    initialAssignedTrack={a.assigned_track}
                    initialTeamNumber={a.team_number}
                  />
                );
              })}
            </tbody>
          </table>
          {hackathonApps.length === 0 ? (
            <p className="py-4 text-center text-sm text-foreground-soft">
              応募はまだありません。
            </p>
          ) : null}
        </div>
      </section>
    </>
  );
}
