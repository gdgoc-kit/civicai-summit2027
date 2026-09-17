import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import AdminNav from "@/components/admin/admin-nav";
import { getAdminSession, AdminGateFallback } from "@/components/admin/admin-gate";
import AdminResultsBoard from "@/components/admin/admin-results-board";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "申込み状況確認 | 管理者ページ",
  description: "CivicAI Summit 2027 の抽選・チーム編成の実行と結果確認ページです。",
};

export default async function AdminStatusPage() {
  const session = await getAdminSession();
  if (session.status !== "ok") {
    return <AdminGateFallback status={session.status} />;
  }

  const supabase = await createClient();
  const [
    { data: registrations },
    { data: sessionApplications },
    { data: hackathonApplications },
    { data: appSettings },
  ] = await Promise.all([
    supabase
      .from("registrations")
      .select("user_id, name, nickname, nickname_reading"),
    supabase
      .from("session_applications")
      .select("user_id, lottery_result, applied_at")
      .order("applied_at", { ascending: true }),
    supabase
      .from("hackathon_applications")
      .select(
        "user_id, quota, track_primary, track_secondary, lottery_result, assigned_track, team_number, applied_at",
      )
      .order("applied_at", { ascending: true }),
    supabase
      .from("app_settings")
      .select("results_confirmed, student_priority_capacity")
      .eq("id", 1)
      .maybeSingle(),
  ]);

  const registrationInfoByUserId = Object.fromEntries(
    (registrations ?? []).map((r) => [
      r.user_id,
      {
        name: r.name,
        nickname: r.nickname,
        nicknameReading: r.nickname_reading,
      },
    ]),
  );

  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="管理者"
        title="申込み状況確認"
        description="抽選・チーム編成の自動実行と、第一部・第二部の応募状況の確認・編集ができます。"
      />
      <div className="mx-auto max-w-5xl px-6">
        <AdminNav current="/admin/status" />

        <AdminResultsBoard
          registrations={registrationInfoByUserId}
          initialSessionApplications={sessionApplications ?? []}
          initialHackathonApplications={hackathonApplications ?? []}
          initialResultsConfirmed={appSettings?.results_confirmed ?? false}
          initialStudentPriorityCapacity={
            appSettings?.student_priority_capacity ?? 105
          }
        />
      </div>
    </div>
  );
}
