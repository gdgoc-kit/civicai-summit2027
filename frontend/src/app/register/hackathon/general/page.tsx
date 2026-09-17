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
  title: "第二部（ハッカソン）学生・社会人枠 応募フォーム",
  description:
    "CivicAI Summit 2027 第二部（ハッカソン）学生・社会人枠 応募者向けの詳細フォームです。",
};

export default async function HackathonGeneralApplicationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: appSettings } = await supabase
    .from("app_settings")
    .select(
      "hackathon_general_reception_starts_at, hackathon_general_reception_ends_at, results_confirmed",
    )
    .eq("id", 1)
    .maybeSingle();
  const startsAt = appSettings?.hackathon_general_reception_starts_at ?? null;
  const endsAt = appSettings?.hackathon_general_reception_ends_at ?? null;
  const resultsConfirmed = appSettings?.results_confirmed ?? false;
  const status = getReceptionStatus(startsAt, endsAt);

  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="第二部応募・学生・社会人枠"
        title="第二部（ハッカソン）学生・社会人枠 応募フォーム"
        maxWidthClassName="max-w-2xl"
      />
      <div className="mx-auto max-w-2xl px-6">
        <p className="mt-4 text-sm text-foreground-soft">
          学生・社会人枠（45名・抽選）は、北陸地域の学校・企業・組織に所属する学生および社会人が対象です。この回答をもって第二部の応募手続き完了となります。
        </p>

        <div className="mt-6">
          <ReceptionCountdown status={status} startsAt={startsAt} endsAt={endsAt} />
        </div>

        <div className="mt-6">
          {!user ? (
            <GoogleLoginButton next="/register/hackathon/general" />
          ) : (
            <GeneralGate
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

async function GeneralGate({
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

  if (status !== "open") {
    return (
      <ReceptionStatusNotice status={status} startsAt={startsAt} endsAt={endsAt} />
    );
  }

  return (
    <HackathonApplicationForm userId={userId} allowedQuotas={["studentGeneral"]} />
  );
}
