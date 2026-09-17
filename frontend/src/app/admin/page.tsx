import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/page-header";
import AdminNav from "@/components/admin/admin-nav";
import { getAdminSession, AdminGateFallback } from "@/components/admin/admin-gate";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "管理者ページ",
  description: "CivicAI Summit 2027 の申込み状況・抽選結果の管理ページです。",
};

const sections = [
  {
    href: "/admin/settings",
    label: "設定",
    body: "募集期間、トップページのお知らせバナー、学生優先枠の定員を設定します。",
  },
  {
    href: "/admin/status",
    label: "申込み状況確認",
    body: "抽選・チーム編成の自動実行と、第一部・第二部の応募状況の確認・編集をします。",
  },
  {
    href: "/admin/list",
    label: "一覧",
    body: "メインイベント登録者・事前登録者の一覧を確認します（閲覧のみ）。",
  },
];

export default async function AdminPage() {
  const session = await getAdminSession();
  if (session.status !== "ok") {
    return <AdminGateFallback status={session.status} />;
  }

  const supabase = await createClient();
  const [
    { count: registrationsCount },
    { count: sessionCount },
    { count: hackathonCount },
    { count: preRegistrationsCount },
  ] = await Promise.all([
    supabase
      .from("registrations")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("session_applications")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("hackathon_applications")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("pre_registrations")
      .select("*", { count: "exact", head: true }),
  ]);

  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="管理者"
        title="管理者ページ"
        description="設定・申込み状況確認・一覧の3つのページに分かれています。"
      />
      <div className="mx-auto max-w-5xl px-6">
        <AdminNav current="/admin" />

        <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-rule bg-card p-6 text-center sm:grid-cols-4">
          <div>
            <dt className="text-xs text-foreground-soft">メインイベント登録</dt>
            <dd className="mt-1 font-display text-xl font-extrabold text-g-blue">
              {registrationsCount ?? 0}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-foreground-soft">第一部応募</dt>
            <dd className="mt-1 font-display text-xl font-extrabold text-g-blue">
              {sessionCount ?? 0}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-foreground-soft">第二部応募</dt>
            <dd className="mt-1 font-display text-xl font-extrabold text-g-blue">
              {hackathonCount ?? 0}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-foreground-soft">事前登録</dt>
            <dd className="mt-1 font-display text-xl font-extrabold text-g-blue">
              {preRegistrationsCount ?? 0}
            </dd>
          </div>
        </dl>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-2xl border border-rule bg-card p-6 transition-colors hover:border-g-blue"
            >
              <h2 className="font-display font-bold group-hover:text-g-blue">
                {section.label}
              </h2>
              <p className="mt-2 text-sm text-foreground-soft">
                {section.body}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
