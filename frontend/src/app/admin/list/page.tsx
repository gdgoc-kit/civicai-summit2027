import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import AdminNav from "@/components/admin/admin-nav";
import { getAdminSession, AdminGateFallback } from "@/components/admin/admin-gate";
import PreRegistrationsPanel from "@/components/admin/pre-registrations-panel";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "一覧 | 管理者ページ",
  description: "CivicAI Summit 2027 のメインイベント登録・事前登録の一覧ページです。",
};

const attendeeTypeLabel: Record<string, string> = {
  student: "学生",
  workingStudent: "社会人学生",
  professional: "社会人",
  other: "その他",
};

const areaLabel: Record<string, string> = {
  ishikawa: "石川県",
  toyama: "富山県",
  fukui: "福井県",
  other: "その他",
};

export default async function AdminListPage() {
  const session = await getAdminSession();
  if (session.status !== "ok") {
    return <AdminGateFallback status={session.status} />;
  }

  const supabase = await createClient();
  const [{ data: registrations }, { data: preRegistrations }] =
    await Promise.all([
      supabase
        .from("registrations")
        .select(
          "user_id, name, nickname, nickname_reading, affiliation, affiliation_area, attendee_type, created_at",
        )
        .order("created_at", { ascending: true }),
      supabase
        .from("pre_registrations")
        .select("email")
        .order("created_at", { ascending: true }),
    ]);

  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="管理者"
        title="一覧"
        description="メインイベント登録者と事前登録者の一覧です（閲覧のみ）。"
      />
      <div className="mx-auto max-w-5xl px-6">
        <AdminNav current="/admin/list" />

        <section className="mt-6">
          <h2 className="font-display text-lg font-bold">
            メインイベント登録一覧
          </h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-rule bg-card p-4">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-rule text-xs text-foreground-soft">
                  <th className="py-2 pr-4 font-normal">氏名</th>
                  <th className="py-2 pr-4 font-normal">ニックネーム（読み方）</th>
                  <th className="py-2 pr-4 font-normal">所属先</th>
                  <th className="py-2 pr-4 font-normal">所在地</th>
                  <th className="py-2 font-normal">区分</th>
                </tr>
              </thead>
              <tbody>
                {(registrations ?? []).map((r) => (
                  <tr key={r.user_id} className="border-b border-rule last:border-0">
                    <td className="whitespace-nowrap py-2 pr-4 text-sm font-bold">
                      {r.name}
                    </td>
                    <td className="whitespace-nowrap py-2 pr-4 text-sm text-foreground-soft">
                      {r.nickname}
                      {r.nickname_reading ? `（${r.nickname_reading}）` : ""}
                    </td>
                    <td className="whitespace-nowrap py-2 pr-4 text-sm text-foreground-soft">
                      {r.affiliation}
                    </td>
                    <td className="whitespace-nowrap py-2 pr-4 text-sm text-foreground-soft">
                      {areaLabel[r.affiliation_area] ?? r.affiliation_area}
                    </td>
                    <td className="whitespace-nowrap py-2 text-sm text-foreground-soft">
                      {attendeeTypeLabel[r.attendee_type] ?? r.attendee_type}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(registrations ?? []).length === 0 ? (
              <p className="py-4 text-center text-sm text-foreground-soft">
                登録はまだありません。
              </p>
            ) : null}
          </div>
        </section>

        <section className="mt-10">
          <PreRegistrationsPanel
            emails={(preRegistrations ?? []).map((r) => r.email)}
          />
        </section>
      </div>
    </div>
  );
}
