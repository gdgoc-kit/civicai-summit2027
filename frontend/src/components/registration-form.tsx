"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FieldErrorMessage from "@/components/field-error-message";
import PostSubmitNav from "@/components/post-submit-nav";
import { createClient } from "@/lib/supabase/client";
import {
  registrationSchema,
  type RegistrationInput,
  attendeeTypeOptions,
  affiliationAreaOptions,
  mediaConsentOptions,
} from "@/lib/registration-schema";

export default function RegistrationForm({ userId }: { userId: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      nickname: "",
      nicknameReading: "",
      affiliation: "",
      accessibilityNotes: "",
      remarks: "",
    },
  });

  const [submittedName, setSubmittedName] = useState<string | null>(null);
  const [submittedArea, setSubmittedArea] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const attendeeTypeId = useId();
  const nameId = useId();
  const nicknameId = useId();
  const nicknameReadingId = useId();
  const affiliationId = useId();
  const affiliationAreaId = useId();
  const mediaConsentId = useId();
  const privacyConsentId = useId();
  const accessibilityNotesId = useId();
  const remarksId = useId();

  const onSubmit = handleSubmit(async (data) => {
    setSubmitError(null);
    const supabase = createClient();
    const { error } = await supabase.from("registrations").insert({
      user_id: userId,
      attendee_type: data.attendeeType,
      name: data.name,
      nickname: data.nickname,
      nickname_reading: data.nicknameReading,
      affiliation: data.affiliation,
      affiliation_area: data.affiliationArea,
      media_consent: data.mediaConsent,
      privacy_consent: data.privacyConsent,
      accessibility_notes: data.accessibilityNotes || null,
      remarks: data.remarks || null,
    });

    if (error) {
      setSubmitError(
        "登録に失敗しました。時間をおいて再度お試しください。",
      );
      return;
    }

    setSubmittedName(data.name);
    setSubmittedArea(data.affiliationArea);
  });

  if (submittedName) {
    return (
      <div
        role="status"
        className="animate-fade-in-up rounded-2xl border border-rule bg-card p-8"
      >
        <p className="text-center font-display text-xl font-extrabold text-g-green">
          メインイベントの登録を確認しました
        </p>
        <p className="mt-3 text-center text-sm text-foreground-soft">
          {submittedName} 様、ありがとうございます。登録内容を受け付けました。
        </p>
        <div className="mt-6 rounded-xl border border-rule bg-white p-5">
          <p className="text-sm font-bold">
            メインイベント登録だけでは、参加は確定しません
          </p>
          <p className="mt-1 text-sm text-foreground-soft">
            参加を希望するプログラムへ、続けてお申し込みください。
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/register/session?area=${submittedArea}`}
              className="rounded-full border border-g-blue px-5 py-2.5 text-center text-sm font-bold text-g-blue transition-colors hover:bg-g-blue hover:text-white"
            >
              第一部（セッション）に申し込む
            </Link>
            <Link
              href="/register/hackathon"
              className="rounded-full bg-g-blue px-5 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-[#1a56c4]"
            >
              第二部（ハッカソン）に申し込む
            </Link>
          </div>
        </div>
        <PostSubmitNav />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      <div>
        <label htmlFor={attendeeTypeId} className="text-sm font-bold">
          1. 参加者区分 <span className="text-g-red">*</span>
        </label>
        <select
          id={attendeeTypeId}
          defaultValue=""
          aria-invalid={!!errors.attendeeType}
          aria-describedby={
            errors.attendeeType ? `${attendeeTypeId}-error` : undefined
          }
          className="mt-2 w-full rounded-lg border border-rule bg-white px-4 py-2.5 text-sm outline-none focus:border-g-blue"
          {...register("attendeeType")}
        >
          <option value="" disabled>
            選択してください
          </option>
          {attendeeTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <FieldErrorMessage
          error={errors.attendeeType}
          id={`${attendeeTypeId}-error`}
        />
      </div>

      <div>
        <label htmlFor={nameId} className="text-sm font-bold">
          2. 氏名 <span className="text-g-red">*</span>
        </label>
        <p className="mt-1 text-xs text-foreground-soft">
          受付時の本人確認および運営上の連絡に使用します。参加者一覧やチーム発表では公開しません。
        </p>
        <input
          id={nameId}
          type="text"
          autoComplete="name"
          maxLength={100}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? `${nameId}-error` : undefined}
          className="mt-2 w-full rounded-lg border border-rule bg-white px-4 py-2.5 text-sm outline-none focus:border-g-blue"
          {...register("name")}
        />
        <FieldErrorMessage error={errors.name} id={`${nameId}-error`} />
      </div>

      <div>
        <label htmlFor={nicknameId} className="text-sm font-bold">
          3. ユーザー名・ニックネーム <span className="text-g-red">*</span>
        </label>
        <p className="mt-1 text-xs text-foreground-soft">
          Slack、チーム発表、参加者間の呼称に使用します。ほかの参加者へ公開してもよい名称を入力してください。
        </p>
        <input
          id={nicknameId}
          type="text"
          autoComplete="nickname"
          maxLength={50}
          aria-invalid={!!errors.nickname}
          aria-describedby={
            errors.nickname ? `${nicknameId}-error` : undefined
          }
          className="mt-2 w-full rounded-lg border border-rule bg-white px-4 py-2.5 text-sm outline-none focus:border-g-blue"
          {...register("nickname")}
        />
        <FieldErrorMessage error={errors.nickname} id={`${nicknameId}-error`} />
      </div>

      <div>
        <label htmlFor={nicknameReadingId} className="text-sm font-bold">
          4. ユーザー名・ニックネームの読み方 <span className="text-g-red">*</span>
        </label>
        <p className="mt-1 text-xs text-foreground-soft">
          チーム発表時の呼称確認などに使用します。ひらがな・カタカナで入力してください。
        </p>
        <input
          id={nicknameReadingId}
          type="text"
          maxLength={50}
          aria-invalid={!!errors.nicknameReading}
          aria-describedby={
            errors.nicknameReading ? `${nicknameReadingId}-error` : undefined
          }
          className="mt-2 w-full rounded-lg border border-rule bg-white px-4 py-2.5 text-sm outline-none focus:border-g-blue"
          {...register("nicknameReading")}
        />
        <FieldErrorMessage
          error={errors.nicknameReading}
          id={`${nicknameReadingId}-error`}
        />
      </div>

      <div>
        <label htmlFor={affiliationId} className="text-sm font-bold">
          5. 所属先 <span className="text-g-red">*</span>
        </label>
        <p className="mt-1 text-xs text-foreground-soft">
          学校名・企業名・団体名などの正式名称を入力してください。
        </p>
        <input
          id={affiliationId}
          type="text"
          autoComplete="organization"
          maxLength={200}
          aria-invalid={!!errors.affiliation}
          aria-describedby={
            errors.affiliation ? `${affiliationId}-error` : undefined
          }
          className="mt-2 w-full rounded-lg border border-rule bg-white px-4 py-2.5 text-sm outline-none focus:border-g-blue"
          {...register("affiliation")}
        />
        <FieldErrorMessage
          error={errors.affiliation}
          id={`${affiliationId}-error`}
        />
      </div>

      <div>
        <label htmlFor={affiliationAreaId} className="text-sm font-bold">
          6. 所属先の所在地 <span className="text-g-red">*</span>
        </label>
        <p className="mt-1 text-xs text-foreground-soft">
          第二部（ハッカソン）の参加条件確認に使用します。第一部のみの参加であれば、北陸地域外からもお申し込みいただけます。
        </p>
        <select
          id={affiliationAreaId}
          defaultValue=""
          aria-invalid={!!errors.affiliationArea}
          aria-describedby={
            errors.affiliationArea ? `${affiliationAreaId}-error` : undefined
          }
          className="mt-2 w-full rounded-lg border border-rule bg-white px-4 py-2.5 text-sm outline-none focus:border-g-blue"
          {...register("affiliationArea")}
        >
          <option value="" disabled>
            選択してください
          </option>
          {affiliationAreaOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <FieldErrorMessage
          error={errors.affiliationArea}
          id={`${affiliationAreaId}-error`}
        />
      </div>

      <fieldset>
        <legend className="text-sm font-bold">
          7. 写真・映像の撮影および広報利用 <span className="text-g-red">*</span>
        </legend>
        <div
          className="mt-2 flex flex-col gap-2"
          aria-invalid={!!errors.mediaConsent}
          aria-describedby={
            errors.mediaConsent ? `${mediaConsentId}-error` : undefined
          }
        >
        {mediaConsentOptions.map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer items-start gap-3 rounded-lg border border-transparent p-2 transition-colors hover:bg-card/50"
          >
            <input
              type="radio"
              value={opt.value}
              className="mt-1 accent-[color:var(--g-blue)] shrink-0"
              {...register("mediaConsent")}
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">
                {opt.label}
              </span>
              {opt.description && (
                <span className="mt-0.5 text-xs leading-relaxed text-foreground-soft">
                  {opt.description}
                </span>
              )}
            </div>
          </label>
        ))}
        </div>
        <FieldErrorMessage
          error={errors.mediaConsent}
          id={`${mediaConsentId}-error`}
        />
      </fieldset>

      <div>
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            id={privacyConsentId}
            aria-invalid={!!errors.privacyConsent}
            aria-describedby={
              errors.privacyConsent ? `${privacyConsentId}-error` : undefined
            }
            className="mt-1 accent-[color:var(--g-blue)]"
            {...register("privacyConsent")}
          />
          <span>
            8. 個人情報の取扱方針に同意する
            <span className="text-g-red"> *</span>
          </span>
        </label>
        <a
          href="/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-xs font-bold text-g-blue hover:underline"
        >
          個人情報の取扱方針を確認する →
        </a>
        <FieldErrorMessage
          error={errors.privacyConsent}
          id={`${privacyConsentId}-error`}
        />
      </div>

      <div>
        <label htmlFor={accessibilityNotesId} className="text-sm font-bold">
          9. 必要な配慮
        </label>
        <p className="mt-1 text-xs text-foreground-soft">
          参加にあたって必要な配慮や、運営へ事前に伝えておきたいことがあればご記入ください。
        </p>
        <textarea
          id={accessibilityNotesId}
          rows={3}
          maxLength={500}
          aria-invalid={!!errors.accessibilityNotes}
          aria-describedby={
            errors.accessibilityNotes
              ? `${accessibilityNotesId}-error`
              : undefined
          }
          className="mt-2 w-full resize-y rounded-lg border border-rule bg-white px-4 py-2.5 text-sm outline-none focus:border-g-blue"
          {...register("accessibilityNotes")}
        />
        <FieldErrorMessage
          error={errors.accessibilityNotes}
          id={`${accessibilityNotesId}-error`}
        />
      </div>

      <div>
        <label htmlFor={remarksId} className="text-sm font-bold">
          10. 備考
        </label>
        <p className="mt-1 text-xs text-foreground-soft">
          その他、運営への連絡事項があればご記入ください。
        </p>
        <textarea
          id={remarksId}
          rows={3}
          maxLength={500}
          aria-invalid={!!errors.remarks}
          aria-describedby={errors.remarks ? `${remarksId}-error` : undefined}
          className="mt-2 w-full resize-y rounded-lg border border-rule bg-white px-4 py-2.5 text-sm outline-none focus:border-g-blue"
          {...register("remarks")}
        />
        <FieldErrorMessage error={errors.remarks} id={`${remarksId}-error`} />
      </div>

      {submitError ? (
        <p role="alert" className="text-sm text-g-red">
          {submitError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-g-blue px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1a56c4] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? "送信中..." : "この内容でメインイベントに登録する"}
      </button>
    </form>
  );
}
