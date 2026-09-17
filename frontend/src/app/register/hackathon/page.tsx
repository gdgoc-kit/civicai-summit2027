import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/page-header";
import GateNoticeCard from "@/components/gate-notice-card";
import HackathonAppliedCard from "@/components/hackathon-applied-card";
import GoogleLoginButton from "@/components/google-login-button";
import {
  getReceptionStatus,
  formatDateTimeJa,
  type ReceptionStatus,
} from "@/lib/reception-window";
import { getHackathonApplicationContext } from "@/lib/hackathon-gate";
import { quotaOptions } from "@/lib/hackathon-application-schema";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "第二部（ハッカソン）申込み",
  description:
    "CivicAI Summit 2027 第二部（ハッカソン）は、学生優先枠・学生・社会人枠のいずれかからお申し込みいただけます。",
};

const statusLabel: Record<string, string> = {
  before: "募集開始前",
  open: "受付中",
  closed: "受付終了",
};

export default async function HackathonHubPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="第二部応募"
        title="第二部（ハッカソン）申込み"
        maxWidthClassName="max-w-2xl"
        description="学生優先枠・学生・社会人枠のいずれか一方のみお申し込みいただけます。ご自身が対象となる枠のページからお申し込みください。"
      />
      <div className="mx-auto max-w-2xl px-6">
        {!user ? (
          <GoogleLoginButton next="/register/hackathon" />
        ) : (
          <HackathonHubGate userId={user.id} />
        )}
      </div>
    </div>
  );
}

async function HackathonHubGate({ userId }: { userId: string }) {
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
    const supabase = await createClient();
    const { data: appSettings } = await supabase
      .from("app_settings")
      .select("results_confirmed")
      .eq("id", 1)
      .maybeSingle();
    return (
      <HackathonAppliedCard
        userId={userId}
        application={ctx.application}
        resultsConfirmed={appSettings?.results_confirmed ?? false}
      />
    );
  }

  const supabase = await createClient();
  const { data: appSettings } = await supabase
    .from("app_settings")
    .select(
      "hackathon_priority_reception_starts_at, hackathon_priority_reception_ends_at, hackathon_general_reception_starts_at, hackathon_general_reception_ends_at",
    )
    .eq("id", 1)
    .maybeSingle();

  const priorityStartsAt =
    appSettings?.hackathon_priority_reception_starts_at ?? null;
  const priorityEndsAt = appSettings?.hackathon_priority_reception_ends_at ?? null;
  const priorityStatus = getReceptionStatus(priorityStartsAt, priorityEndsAt);

  const generalStartsAt =
    appSettings?.hackathon_general_reception_starts_at ?? null;
  const generalEndsAt = appSettings?.hackathon_general_reception_ends_at ?? null;
  const generalStatus = getReceptionStatus(generalStartsAt, generalEndsAt);

  let priorityFull = false;
  if (ctx.isStudent && priorityStatus === "open") {
    const { data: priorityCount } = await supabase
      .rpc("get_student_priority_status")
      .maybeSingle<{ current_count: number; capacity: number }>();
    priorityFull = !!priorityCount && priorityCount.current_count >= priorityCount.capacity;
  }

  const priorityOption = quotaOptions.find((o) => o.value === "studentPriority")!;
  const generalOption = quotaOptions.find((o) => o.value === "studentGeneral")!;

  return (
    <div className="space-y-4">
      {ctx.isStudent ? (
        <QuotaCard
          href="/register/hackathon/priority"
          label={priorityOption.label}
          description={priorityOption.description}
          status={priorityStatus}
          startsAt={priorityStartsAt}
          endsAt={priorityEndsAt}
          full={priorityFull}
        />
      ) : null}
      <QuotaCard
        href="/register/hackathon/general"
        label={generalOption.label}
        description={generalOption.description}
        status={generalStatus}
        startsAt={generalStartsAt}
        endsAt={generalEndsAt}
      />
      {!ctx.isStudent ? (
        <p className="text-xs text-foreground-soft">
          ※
          学生優先枠は、北陸地域の学校に所属する学生（社会人学生を除く）が対象のため表示していません。
        </p>
      ) : null}
    </div>
  );
}

function QuotaCard({
  href,
  label,
  description,
  status,
  startsAt,
  endsAt,
  full = false,
}: {
  href: string;
  label: string;
  description: string;
  status: ReceptionStatus;
  startsAt: string | null;
  endsAt: string | null;
  full?: boolean;
}) {
  const clickable = status === "open" && !full;
  const badgeLabel = full ? "定員に達しました" : statusLabel[status];

  const body = (
    <div
      className={`rounded-2xl border p-6 transition-colors ${
        clickable
          ? "border-rule bg-card hover:border-g-blue"
          : "border-rule bg-card opacity-60"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="font-display font-bold">{label}</p>
        <span className="shrink-0 rounded-full bg-rule px-3 py-1 text-xs font-bold text-foreground-soft">
          {badgeLabel}
        </span>
      </div>
      <p className="mt-2 text-sm text-foreground-soft">{description}</p>
      {status === "before" && startsAt ? (
        <p className="mt-2 text-xs text-foreground-soft">
          受付開始予定：{formatDateTimeJa(startsAt)}
        </p>
      ) : null}
      {status === "open" && endsAt ? (
        <p className="mt-2 text-xs text-foreground-soft">
          受付終了予定：{formatDateTimeJa(endsAt)}
        </p>
      ) : null}
      {clickable ? (
        <p className="mt-3 text-sm font-bold text-g-blue">この枠に申し込む →</p>
      ) : null}
    </div>
  );

  if (!clickable) {
    return body;
  }

  return <Link href={href}>{body}</Link>;
}
