import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import AdminNav from "@/components/admin/admin-nav";
import { getAdminSession, AdminGateFallback } from "@/components/admin/admin-gate";
import ReceptionWindowPanel from "@/components/admin/reception-window-panel";
import HomeBannerPanel from "@/components/admin/home-banner-panel";
import StudentPriorityCapacityPanel from "@/components/admin/student-priority-capacity-panel";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "設定 | 管理者ページ",
  description: "CivicAI Summit 2027 の受付期間・バナー等の設定ページです。",
};

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  if (session.status !== "ok") {
    return <AdminGateFallback status={session.status} />;
  }

  const supabase = await createClient();
  const [{ data: appSettings }, { count: studentPriorityCount }] =
    await Promise.all([
      supabase
        .from("app_settings")
        .select(
          "reception_starts_at, reception_ends_at, session_reception_starts_at, session_reception_ends_at, hackathon_priority_reception_starts_at, hackathon_priority_reception_ends_at, hackathon_general_reception_starts_at, hackathon_general_reception_ends_at, home_banner_text, home_banner_href, student_priority_capacity",
        )
        .eq("id", 1)
        .maybeSingle(),
      supabase
        .from("hackathon_applications")
        .select("*", { count: "exact", head: true })
        .eq("quota", "studentPriority"),
    ]);

  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="管理者"
        title="設定"
        description="募集期間・トップページのお知らせ・学生優先枠の定員を設定します。"
      />
      <div className="mx-auto max-w-5xl px-6">
        <AdminNav current="/admin/settings" />

        <div className="mt-6 space-y-6">
          <ReceptionWindowPanel
            title="メインイベント登録の受付期間"
            description="メインイベント登録フォームに適用されます。開始日時・終了日時は片方だけの入力も可能です（その方向は制限なし）。両方空欄のままだと「受付開始前」として扱われ、登録はできません。すでに申し込み済みの内容の閲覧・キャンセルは、受付期間の影響を受けません。"
            startsAtField="reception_starts_at"
            endsAtField="reception_ends_at"
            initialStartsAt={appSettings?.reception_starts_at ?? null}
            initialEndsAt={appSettings?.reception_ends_at ?? null}
          />
          <ReceptionWindowPanel
            title="第一部（セッション）の受付期間"
            description="/register/session に適用されます。開始日時・終了日時は片方だけの入力も可能です（その方向は制限なし）。両方空欄のままだと「受付開始前」として扱われ、申込みはできません。"
            startsAtField="session_reception_starts_at"
            endsAtField="session_reception_ends_at"
            initialStartsAt={appSettings?.session_reception_starts_at ?? null}
            initialEndsAt={appSettings?.session_reception_ends_at ?? null}
          />
          <ReceptionWindowPanel
            title="第二部・学生優先枠の受付期間"
            description="/register/hackathon/priority に適用されます。開始日時・終了日時は片方だけの入力も可能です（その方向は制限なし）。両方空欄のままだと「受付開始前」として扱われ、申込みはできません。"
            startsAtField="hackathon_priority_reception_starts_at"
            endsAtField="hackathon_priority_reception_ends_at"
            initialStartsAt={
              appSettings?.hackathon_priority_reception_starts_at ?? null
            }
            initialEndsAt={
              appSettings?.hackathon_priority_reception_ends_at ?? null
            }
          />
          <ReceptionWindowPanel
            title="第二部・学生・社会人枠の受付期間"
            description="/register/hackathon/general に適用されます。開始日時・終了日時は片方だけの入力も可能です（その方向は制限なし）。両方空欄のままだと「受付開始前」として扱われ、申込みはできません。"
            startsAtField="hackathon_general_reception_starts_at"
            endsAtField="hackathon_general_reception_ends_at"
            initialStartsAt={
              appSettings?.hackathon_general_reception_starts_at ?? null
            }
            initialEndsAt={
              appSettings?.hackathon_general_reception_ends_at ?? null
            }
          />
          <HomeBannerPanel
            initialText={appSettings?.home_banner_text ?? null}
            initialHref={appSettings?.home_banner_href ?? null}
          />
          <StudentPriorityCapacityPanel
            currentCount={studentPriorityCount ?? 0}
            initialCapacity={appSettings?.student_priority_capacity ?? 105}
          />
        </div>
      </div>
    </div>
  );
}
