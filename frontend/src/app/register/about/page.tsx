import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/page-header";
import {
  getReceptionStatus,
  formatDateTimeJa,
  type ReceptionStatus,
} from "@/lib/reception-window";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "申込について",
  description:
    "CivicAI Summit 2027 の申込みの流れ（メインイベント登録と、第一部・第二部それぞれへの個別申込み）についてのご案内です。",
};

const statusLabel: Record<ReceptionStatus, string> = {
  before: "募集開始前",
  open: "受付中",
  closed: "受付終了",
};

export default async function RegisterAboutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let showPriority = true;
  if (user) {
    const { data: registration } = await supabase
      .from("registrations")
      .select("attendee_type")
      .eq("user_id", user.id)
      .maybeSingle();
    if (registration) {
      showPriority = registration.attendee_type === "student";
    }
  }

  const { data: appSettings } = await supabase
    .from("app_settings")
    .select(
      "session_reception_starts_at, session_reception_ends_at, hackathon_priority_reception_starts_at, hackathon_priority_reception_ends_at, hackathon_general_reception_starts_at, hackathon_general_reception_ends_at",
    )
    .eq("id", 1)
    .maybeSingle();

  const tracks = [
    {
      name: "第一部（セッション）",
      href: "/register/session",
      target: "学生・社会人・自治体・企業・教育機関・地域団体等",
      capacity: "250名",
      method: "抽選",
      startsAt: appSettings?.session_reception_starts_at ?? null,
      endsAt: appSettings?.session_reception_ends_at ?? null,
    },
    {
      name: "第二部（ハッカソン）学生優先枠",
      href: "/register/hackathon/priority",
      target: "北陸地域の学校に所属する学生（社会人学生を除く）",
      capacity: "105名",
      method: "先着順",
      startsAt: appSettings?.hackathon_priority_reception_starts_at ?? null,
      endsAt: appSettings?.hackathon_priority_reception_ends_at ?? null,
    },
    {
      name: "第二部（ハッカソン）学生・社会人枠",
      href: "/register/hackathon/general",
      target: "北陸地域の学校・企業・組織に所属する学生および社会人",
      capacity: "45名",
      method: "抽選",
      startsAt: appSettings?.hackathon_general_reception_starts_at ?? null,
      endsAt: appSettings?.hackathon_general_reception_ends_at ?? null,
    },
  ].filter((track) => showPriority || track.href !== "/register/hackathon/priority");

  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="申込について"
        title="申込みの流れ"
        description="CivicAI Summit 2027への参加には、2段階の申込みが必要です。"
      />
      <div className="mx-auto max-w-5xl px-6">
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-rule bg-card p-6">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-g-blue">
              Step 1
            </p>
            <h2 className="mt-2 font-display text-lg font-bold">
              メインイベント登録
            </h2>
            <p className="mt-2 text-sm text-foreground-soft">
              CivicAI Summit 2027
              全体への共通登録です。イベント全体の重複を除いた申込者数の把握に使用します。第一部・第二部への申込みには、先にこの登録が必要です。
            </p>
            <Link
              href="/register"
              className="mt-3 inline-block text-sm font-bold text-g-blue hover:underline"
            >
              メインイベント登録へ →
            </Link>
          </div>
          <div className="rounded-2xl border border-rule bg-card p-6">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-g-blue">
              Step 2
            </p>
            <h2 className="mt-2 font-display text-lg font-bold">
              プログラムごとの個別申込み
            </h2>
            <p className="mt-2 text-sm text-foreground-soft">
              参加を希望するプログラム（第一部セッション・第二部ハッカソン）へ、それぞれ別途お申し込みください。メインイベント登録だけでは、各プログラムへの参加は完了しません。第二部は「学生優先枠」「学生・社会人枠」のいずれか一方のみお申し込みいただけます。
            </p>
          </div>
        </div>

        <div className="mt-14">
          <h2 className="font-display text-2xl font-extrabold">
            申込み先一覧
          </h2>
          <div className="mt-6 space-y-4">
            {tracks.map((track) => {
              const status = getReceptionStatus(track.startsAt, track.endsAt);
              return (
                <Link
                  key={track.href}
                  href={track.href}
                  className="block rounded-2xl border border-rule bg-card p-6 transition-colors hover:border-g-blue"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-display font-bold">{track.name}</p>
                    <span className="shrink-0 rounded-full bg-rule px-3 py-1 text-xs font-bold text-foreground-soft">
                      {statusLabel[status]}
                    </span>
                  </div>
                  <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                    <div>
                      <dt className="text-xs text-foreground-soft">対象</dt>
                      <dd className="mt-0.5 font-bold">{track.target}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-foreground-soft">定員</dt>
                      <dd className="mt-0.5 font-bold">{track.capacity}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-foreground-soft">方式</dt>
                      <dd className="mt-0.5 font-bold">{track.method}</dd>
                    </div>
                  </dl>
                  {status === "before" && track.startsAt ? (
                    <p className="mt-3 text-xs text-foreground-soft">
                      受付開始予定：{formatDateTimeJa(track.startsAt)}
                    </p>
                  ) : null}
                  {status === "open" && track.endsAt ? (
                    <p className="mt-3 text-xs text-foreground-soft">
                      受付終了予定：{formatDateTimeJa(track.endsAt)}
                    </p>
                  ) : null}
                </Link>
              );
            })}
          </div>
          <p className="mt-6 text-xs text-foreground-soft">
            ※
            各申込みページでは、メインイベント登録の有無や対象地域などの条件を満たしているかを個別に確認します。条件を満たさない場合は、申込みページ上でご案内します。
            {!showPriority
              ? "学生優先枠は、北陸地域の学校に所属する学生（社会人学生を除く）が対象のため表示していません。"
              : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
