import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/page-header";
import RegistrationForm from "@/components/registration-form";
import PostSubmitNav from "@/components/post-submit-nav";
import CancelButton from "@/components/cancel-button";
import GoogleLoginButton from "@/components/google-login-button";
import ReceptionStatusNotice from "@/components/reception-status-notice";
import ReceptionCountdown from "@/components/reception-countdown";
import PreRegisterButton from "@/components/pre-register-button";
import { getReceptionStatus, type ReceptionStatus } from "@/lib/reception-window";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "メインイベント登録",
  description: "CivicAI Summit 2027 のメインイベント登録フォームです。",
};

export default async function RegisterPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: appSettings } = await supabase
    .from("app_settings")
    .select("reception_starts_at, reception_ends_at")
    .eq("id", 1)
    .maybeSingle();
  const startsAt = appSettings?.reception_starts_at ?? null;
  const endsAt = appSettings?.reception_ends_at ?? null;
  const status = getReceptionStatus(startsAt, endsAt);

  const isBeforeOpen = status === "before";

  return (
    <div className="pb-20">
      <PageHeader
        eyebrow={isBeforeOpen ? "事前登録" : "申込み"}
        title={isBeforeOpen ? "メインイベント事前登録" : "メインイベント登録"}
        maxWidthClassName="max-w-2xl"
      />
      <div className="mx-auto max-w-2xl px-6">
        <p className="mt-4 text-sm text-foreground-soft">
          CivicAI Summit 2027
          全体への共通登録です。イベント全体の重複を除いた申込者数の把握に使用します。
          <br />
          登録後、参加を希望するプログラム（第一部セッション・第二部ハッカソン）へ別途お申し込みください。メインイベント登録だけでは、各プログラムへの参加は完了しません。
          {isBeforeOpen
            ? "本登録の受付開始前は、事前登録いただいた方に開始のご連絡をします。"
            : ""}
        </p>
        <Link
          href="/register/about"
          className="mt-2 inline-block text-sm font-bold text-g-blue hover:underline"
        >
          申込みの流れを詳しく見る →
        </Link>

        <div className="mt-6">
          <ReceptionCountdown status={status} startsAt={startsAt} endsAt={endsAt} />
        </div>

        <div className="mt-6">
          {!user ? (
            <GoogleLoginButton next="/register" />
          ) : (
            <RegisteredOrForm
              userId={user.id}
              email={user.email ?? ""}
              status={status}
              startsAt={startsAt}
              endsAt={endsAt}
            />
          )}
        </div>
      </div>
    </div>
  );
}

async function RegisteredOrForm({
  userId,
  email,
  status,
  startsAt,
  endsAt,
}: {
  userId: string;
  email: string;
  status: ReceptionStatus;
  startsAt: string | null;
  endsAt: string | null;
}) {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("registrations")
    .select("name")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    return (
      <div className="animate-fade-in-up rounded-2xl border border-rule bg-card p-8 text-center">
        <p className="font-display text-lg font-extrabold text-g-green">
          登録済みです
        </p>
        <p className="mt-2 text-sm text-foreground-soft">
          {existing.name} 様のメインイベント登録を受け付けています。
        </p>
        <div className="flex justify-center">
          <CancelButton
            table="registrations"
            userId={userId}
            label="登録をキャンセルする"
            confirmMessage="メインイベント登録をキャンセルします。第一部・第二部への申込みも同時にキャンセルされます。よろしいですか？"
            toastMessage="メインイベント登録をキャンセルしました"
            cascadeTables={["session_applications", "hackathon_applications"]}
          />
        </div>
        <PostSubmitNav />
      </div>
    );
  }

  if (status === "before") {
    const { data: preRegistration } = await supabase
      .from("pre_registrations")
      .select("email")
      .eq("user_id", userId)
      .maybeSingle();

    if (preRegistration) {
      return (
        <div className="animate-fade-in-up rounded-2xl border border-rule bg-card p-8 text-center">
          <p className="font-display text-lg font-extrabold text-g-green">
            事前登録済みです
          </p>
          <p className="mt-2 text-sm text-foreground-soft">
            申込み開始時に、kit@gdgoc.jp より {preRegistration.email} 宛にご連絡します。
          </p>
        </div>
      );
    }

    return <PreRegisterButton userId={userId} email={email} />;
  }

  if (status === "closed") {
    return (
      <ReceptionStatusNotice status={status} startsAt={startsAt} endsAt={endsAt} />
    );
  }

  return <RegistrationForm userId={userId} />;
}
