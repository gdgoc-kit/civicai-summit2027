import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import GoogleLoginButton from "@/components/google-login-button";

export const metadata: Metadata = {
  title: "ログイン",
  description: "CivicAI Summit 2027 マイページへのログインです。",
};

export default async function LoginPage(props: PageProps<"/login">) {
  const searchParams = await props.searchParams;
  const nextParam = searchParams.next;
  const next = Array.isArray(nextParam) ? nextParam[0] : (nextParam ?? "/mypage");

  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="ログイン"
        title="マイページへのログイン"
        maxWidthClassName="max-w-2xl"
      />
      <div className="mx-auto max-w-2xl px-6">
        <p className="mt-4 text-sm text-foreground-soft">
          Googleアカウントでログインしてください。パスワードの設定・入力は不要です。
        </p>
        <div className="mt-8">
          <GoogleLoginButton next={next} />
        </div>
      </div>
    </div>
  );
}
