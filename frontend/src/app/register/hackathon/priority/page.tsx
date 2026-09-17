import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import HackathonApplicationForm from "@/components/hackathon-application-form";
import GateNoticeCard from "@/components/gate-notice-card";
import HackathonAppliedCard from "@/components/hackathon-applied-card";
import GoogleLoginButton from "@/components/google-login-button";
import ReceptionStatusNotice from "@/components/reception-status-notice";
import ReceptionCountdown from "@/components/reception-countdown";
import { getReceptionStatus, type ReceptionStatus } from "@/lib/reception-window";
import { getHackathonApplicationContext } from "@/lib/hackathon-gate";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "第二部（ハッカソン）学生優先枠 応募フォーム",
  description:
    "CivicAI Summit 2027 第二部（ハッカソン）学生優先枠 応募者向けの詳細フォームです。",
};

export default async function HackathonPriorityApplicationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: appSettings } = await supabase
    .from("app_settings")
    .select(
      "hackathon_priority_reception_starts_at, hackathon_priority_reception_ends_at, results_confirmed",
    )
    .eq("id", 1)
    .maybeSingle();
  const startsAt = appSettings?.hackathon_priority_reception_starts_at ?? null;
  const endsAt = appSettings?.hackathon_priority_reception_ends_at ?? null;
  const resultsConfirmed = appSettings?.results_confirmed ?? false;
  const status = getReceptionStatus(startsAt, endsAt);

  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="第二部応募・学生優先枠"
        title="第二部（ハッカソン）学生優先枠 応募フォーム"
        maxWidthClassName="max-w-2xl"
      />
      <div className="mx-auto max-w-2xl px-6">
        <p className="mt-4 text-sm text-foreground-soft">
          学生優先枠（105名・先着順）は、北陸地域の学校に所属する学生（社会人学生を除く）が対象です。この回答をもって第二部の応募手続き完了となります。
        </p>

        <div className="mt-6">
          <ReceptionCountdown status={status} startsAt={startsAt} endsAt={endsAt} />
        </div>

        <div className="mt-6">
          {!user ? (
            <GoogleLoginButton next="/register/hackathon/priority" />
          ) : (
            <PriorityGate
              userId={user.id}
              status={status}
              startsAt={startsAt}
              endsAt={endsAt}
              resultsConfirmed={resultsConfirmed}
            />
          )}
        </div>
      </div>
    </div>
  );
}

async function PriorityGate({
  userId,
  status,
  startsAt,
  endsAt,
  resultsConfirmed,
}: {
  userId: string;
  status: ReceptionStatus;
  startsAt: string | null;
  endsAt: string | null;
  resultsConfirmed: boolean;
}) {
  const ctx = await getHackathonApplicationContext(userId);

  if (ctx.kind === "not-registered") {
    return (
      <GateNoticeCard
        message="第二部への応募には、先にメインイベント登録が必要です。"
        ctaHref="/register"
        ctaLabel="メインイベント登録へ"
      />
    );
  }

  if (ctx.kind === "not-hokuriku") {
    return (
      <GateNoticeCard message="第二部（ハッカソン）は、北陸3県（石川・富山・福井）の学校・企業・組織に所属する方が対象です。" />
    );
  }

  if (ctx.kind === "already-applied") {
    return (
      <HackathonAppliedCard
        userId={userId}
        application={ctx.application}
        resultsConfirmed={resultsConfirmed}
      />
    );
  }

  if (!ctx.isStudent) {
    return (
      <GateNoticeCard
        message="学生優先枠は、北陸地域の学校に所属する学生（社会人学生を除く）が対象です。学生・社会人枠からお申し込みください。"
        ctaHref="/register/hackathon/general"
        ctaLabel="学生・社会人枠の申込みへ"
      />
    );
  }

  if (status !== "open") {
    return (
      <ReceptionStatusNotice status={status} startsAt={startsAt} endsAt={endsAt} />
    );
  }

  const supabase = await createClient();
  const { data: priorityStatus } = await supabase
    .rpc("get_student_priority_status")
    .maybeSingle<{ current_count: number; capacity: number }>();
  const studentPriorityFull =
    !!priorityStatus && priorityStatus.current_count >= priorityStatus.capacity;

  if (studentPriorityFull) {
    return (
      <GateNoticeCard
        message="学生優先枠が定員に達しました。学生・社会人枠からお申し込みください。"
        ctaHref="/register/hackathon/general"
        ctaLabel="学生・社会人枠の申込みへ"
      />
    );
  }

  return (
    <HackathonApplicationForm
      userId={userId}
      allowedQuotas={["studentPriority"]}
      studentPriorityFull={false}
    />
  );
}
