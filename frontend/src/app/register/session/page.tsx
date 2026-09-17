import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import SessionApplyButton from "@/components/session-apply-button";
import PostSubmitNav from "@/components/post-submit-nav";
import CancelButton from "@/components/cancel-button";
import GoogleLoginButton from "@/components/google-login-button";
import GateNoticeCard from "@/components/gate-notice-card";
import ReceptionStatusNotice from "@/components/reception-status-notice";
import ReceptionCountdown from "@/components/reception-countdown";
import { getReceptionStatus, type ReceptionStatus } from "@/lib/reception-window";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "第一部（セッション）申込み",
  description: "CivicAI Summit 2027 第一部（セッション）の参加申込みページです。",
};

const details = [
  { label: "内容", value: "Google関係者・GDE・CivicTech実践者等によるセッション" },
  { label: "定員", value: "250名" },
  { label: "方式", value: "抽選" },
  {
    label: "対象",
    value: "学生・社会人・自治体・企業・教育機関・地域団体等",
  },
];

const hokurikuAreas = new Set(["ishikawa", "toyama", "fukui"]);

const lotteryLabel: Record<string, string> = {
  pending: "抽選待ち",
  won: "当選",
  lost: "落選",
};

export default async function SessionApplicationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: appSettings } = await supabase
    .from("app_settings")
    .select(
      "session_reception_starts_at, session_reception_ends_at, results_confirmed",
    )
    .eq("id", 1)
    .maybeSingle();
  const startsAt = appSettings?.session_reception_starts_at ?? null;
  const endsAt = appSettings?.session_reception_ends_at ?? null;
  const resultsConfirmed = appSettings?.results_confirmed ?? false;
  const status = getReceptionStatus(startsAt, endsAt);

  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="第一部応募"
        title="第一部（セッション）申込み"
        maxWidthClassName="max-w-2xl"
      />
      <div className="mx-auto max-w-2xl px-6">
        <p className="mt-4 text-sm text-foreground-soft">
          第二部（ハッカソン）とは独立したプログラムで、第一部のみの参加も可能です。追加の質問はなく、下のボタンから参加意思を申し込めます。
        </p>

        <div className="mt-6">
          <ReceptionCountdown status={status} startsAt={startsAt} endsAt={endsAt} />
        </div>

        <dl className="mt-6 grid gap-4 rounded-2xl border border-rule bg-card p-6 sm:grid-cols-2">
          {details.map((item) => (
            <div key={item.label}>
              <dt className="font-mono text-xs text-foreground-soft">
                {item.label}
              </dt>
              <dd className="mt-1 text-sm font-bold">{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6">
          {!user ? (
            <GoogleLoginButton next="/register/session" />
          ) : (
            <SessionGate
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

async function SessionGate({
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
  const supabase = await createClient();

  const { data: registration } = await supabase
    .from("registrations")
    .select("affiliation_area, attendee_type")
    .eq("user_id", userId)
    .maybeSingle();

  if (!registration) {
    return (
      <GateNoticeCard
        message="第一部への申込みには、先にメインイベント登録が必要です。"
        ctaHref="/register"
        ctaLabel="メインイベント登録へ"
      />
    );
  }

  const { data: application } = await supabase
    .from("session_applications")
    .select("lottery_result")
    .eq("user_id", userId)
    .maybeSingle();

  if (application) {
    return (
      <div className="animate-fade-in-up rounded-2xl border border-rule bg-card p-8 text-center">
        <p className="font-display text-lg font-extrabold text-g-green">
          申込み済みです
        </p>
        <p className="mt-2 text-sm text-foreground-soft">
          抽選結果：
          {resultsConfirmed
            ? (lotteryLabel[application.lottery_result] ?? "抽選待ち")
            : "抽選待ち"}
        </p>
        <div className="flex justify-center">
          <CancelButton
            table="session_applications"
            userId={userId}
            label="申込みをキャンセルする"
            confirmMessage="第一部（セッション）への申込みをキャンセルします。よろしいですか？"
            toastMessage="第一部の申込みをキャンセルしました"
          />
        </div>
        <PostSubmitNav />
      </div>
    );
  }

  if (status !== "open") {
    return (
      <ReceptionStatusNotice status={status} startsAt={startsAt} endsAt={endsAt} />
    );
  }

  const isHokuriku = hokurikuAreas.has(registration.affiliation_area);
  return <SessionApplyButton userId={userId} showHackathonCta={isHokuriku} />;
}
