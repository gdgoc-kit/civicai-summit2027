import PageHeader from "@/components/page-header";
import GoogleLoginButton from "@/components/google-login-button";
import { createClient } from "@/lib/supabase/server";

export type AdminSession =
  | { status: "logged-out" }
  | { status: "forbidden" }
  | { status: "ok"; userId: string };

export async function getAdminSession(): Promise<AdminSession> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "logged-out" };
  }

  const { data: adminCheck } = await supabase
    .from("admin_emails")
    .select("email")
    .eq("email", user.email ?? "")
    .maybeSingle();

  if (!adminCheck) {
    return { status: "forbidden" };
  }

  return { status: "ok", userId: user.id };
}

export function AdminGateFallback({
  status,
}: {
  status: "logged-out" | "forbidden";
}) {
  return (
    <div className="pb-20">
      <PageHeader eyebrow="管理者" title="管理者ページ" />
      <div className="mx-auto max-w-2xl px-6">
        {status === "logged-out" ? (
          <div className="mt-8">
            <GoogleLoginButton next="/admin" />
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-rule bg-card p-8 text-center">
            <p className="text-sm text-foreground-soft">
              このアカウントには管理者ページへのアクセス権がありません。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
