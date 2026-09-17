import CancelButton from "@/components/cancel-button";
import PostSubmitNav from "@/components/post-submit-nav";
import type { HackathonApplicationRecord } from "@/lib/hackathon-gate";

const lotteryLabel: Record<string, string> = {
  pending: "抽選待ち",
  won: "当選",
  lost: "落選",
};

const quotaLabel: Record<string, string> = {
  studentPriority: "学生優先枠",
  studentGeneral: "学生・社会人枠",
};

export default function HackathonAppliedCard({
  userId,
  application,
  resultsConfirmed,
}: {
  userId: string;
  application: HackathonApplicationRecord;
  resultsConfirmed: boolean;
}) {
  return (
    <div className="animate-fade-in-up rounded-2xl border border-rule bg-card p-8 text-center">
      <p className="font-display text-lg font-extrabold text-g-green">
        応募済みです
      </p>
      <p className="mt-2 text-sm text-foreground-soft">
        申込み枠：{quotaLabel[application.quota] ?? application.quota}
        <br />
        抽選結果：
        {resultsConfirmed
          ? (lotteryLabel[application.lottery_result] ?? "抽選待ち")
          : "抽選待ち"}
        {resultsConfirmed && application.team_number ? (
          <>
            <br />
            チーム番号：{application.team_number}
          </>
        ) : null}
      </p>
      <div className="flex justify-center">
        <CancelButton
          table="hackathon_applications"
          userId={userId}
          label="応募をキャンセルする"
          confirmMessage="第二部（ハッカソン）への応募をキャンセルします。よろしいですか？"
          toastMessage="第二部の応募をキャンセルしました"
        />
      </div>
      <PostSubmitNav />
    </div>
  );
}
