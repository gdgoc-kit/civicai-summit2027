"use client";

import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FieldErrorMessage from "@/components/field-error-message";
import PostSubmitNav from "@/components/post-submit-nav";
import { createClient } from "@/lib/supabase/client";
import {
  hackathonApplicationSchema,
  type HackathonApplicationInput,
  trackOptions,
  roleOptions,
  uiuxInterestOptions,
  experienceLevelOptions,
  hackathonExperienceOptions,
  teamPreferenceOptions,
  shuttleBusOptions,
  foodAllergyOptions,
  quotaOptions,
} from "@/lib/hackathon-application-schema";

export default function HackathonApplicationForm({
  userId,
  allowedQuotas,
  studentPriorityFull = false,
}: {
  userId: string;
  allowedQuotas: ("studentPriority" | "studentGeneral")[];
  studentPriorityFull?: boolean;
}) {
  const selectableQuotas = allowedQuotas.filter(
    (q) => q !== "studentPriority" || !studentPriorityFull,
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<HackathonApplicationInput>({
    resolver: zodResolver(hackathonApplicationSchema),
    defaultValues: {
      quota: selectableQuotas.length === 1 ? selectableQuotas[0] : undefined,
      rolePreference: [],
      teammateRequest: "",
      accessibilityNeeds: "",
      foodAllergyDetail: "",
      remarks: "",
    },
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const foodAllergy = watch("foodAllergy");

  const quotaId = useId();
  const trackPrimaryId = useId();
  const trackSecondaryId = useId();
  const roleId = useId();
  const uiuxInterestId = useId();
  const experienceLevelId = useId();
  const hackathonExperienceId = useId();
  const teamPreferenceId = useId();
  const teammateRequestId = useId();
  const shuttleBusId = useId();
  const foodAllergyId = useId();
  const foodAllergyDetailId = useId();
  const accessibilityNeedsId = useId();
  const teamConsentId = useId();
  const remarksId = useId();

  const onSubmit = handleSubmit(async (data) => {
    setSubmitError(null);
    const supabase = createClient();
    const { error } = await supabase.from("hackathon_applications").insert({
      user_id: userId,
      quota: data.quota,
      track_primary: data.trackPrimary,
      track_secondary: data.trackSecondary,
      role_preference: data.rolePreference,
      uiux_interest: data.uiuxInterest,
      experience_level: data.experienceLevel,
      hackathon_experience: data.hackathonExperience || null,
      team_preference: data.teamPreference,
      teammate_request: data.teammateRequest || null,
      shuttle_bus: data.shuttleBus,
      food_allergy: data.foodAllergy,
      food_allergy_detail: data.foodAllergyDetail || null,
      accessibility_needs: data.accessibilityNeeds || null,
      team_consent: data.teamConsent,
      remarks: data.remarks || null,
    });

    if (error) {
      if (error.message.includes("student_priority_full")) {
        setSubmitError(
          "学生優先枠が定員に達しました。学生・社会人枠に応募してください。",
        );
        setValue("quota", "studentGeneral");
        return;
      }
      setSubmitError("応募に失敗しました。時間をおいて再度お試しください。");
      return;
    }

    setSubmitted(true);
  });

  if (submitted) {
    return (
      <div
        role="status"
        className="animate-fade-in-up rounded-2xl border border-rule bg-card p-8 text-center"
      >
        <p className="font-display text-xl font-extrabold text-g-green">
          第二部応募を受け付けました
        </p>
        <p className="mt-3 text-sm text-foreground-soft">
          回答ありがとうございます。この回答をもって第二部の応募手続き完了となります。抽選結果・チーム情報はマイページでご確認いただけます。
        </p>
        <PostSubmitNav />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      {allowedQuotas.length > 1 ? (
        <fieldset>
          <legend className="text-sm font-bold">
            0. 申込み枠 <span className="text-g-red">*</span>
          </legend>
          <div className="mt-2 flex flex-col gap-2">
            {quotaOptions
              .filter((opt) => allowedQuotas.includes(opt.value))
              .map((opt) => {
                const isFull =
                  opt.value === "studentPriority" && studentPriorityFull;
                return (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-2 text-sm ${
                      isFull ? "opacity-50" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      value={opt.value}
                      disabled={isFull}
                      className="mt-0.5 accent-[color:var(--g-blue)]"
                      {...register("quota")}
                    />
                    <span>
                      {opt.label}
                      {isFull ? (
                        <span className="ml-2 inline-block rounded-full bg-rule px-2 py-0.5 text-xs font-bold text-foreground-soft">
                          定員に達しました
                        </span>
                      ) : null}
                      <span className="block text-xs text-foreground-soft">
                        {opt.description}
                      </span>
                    </span>
                  </label>
                );
              })}
          </div>
          <FieldErrorMessage error={errors.quota} id={`${quotaId}-error`} />
          {studentPriorityFull ? (
            <p className="mt-2 text-xs font-bold text-g-red">
              学生優先枠が定員に達しました。学生・社会人枠に応募してください。
            </p>
          ) : (
            <p className="mt-2 text-xs text-foreground-soft">
              どちらか一方のみ選択できます。両方への同時応募はできません。
            </p>
          )}
        </fieldset>
      ) : (
        <div className="rounded-2xl border border-rule bg-card p-4 text-sm">
          <p className="font-bold">申込み枠</p>
          <p className="mt-1 text-foreground-soft">
            {quotaOptions.find((opt) => opt.value === allowedQuotas[0])
              ?.label ?? allowedQuotas[0]}
            での応募になります。
          </p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={trackPrimaryId} className="text-sm font-bold">
            1. 希望トラック（第1希望） <span className="text-g-red">*</span>
          </label>
          <select
            id={trackPrimaryId}
            defaultValue=""
            aria-invalid={!!errors.trackPrimary}
            aria-describedby={
              errors.trackPrimary ? `${trackPrimaryId}-error` : undefined
            }
            className="mt-2 w-full rounded-lg border border-rule bg-white px-4 py-2.5 text-sm outline-none focus:border-g-blue"
            {...register("trackPrimary")}
          >
            <option value="" disabled>
              選択してください
            </option>
            {trackOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <FieldErrorMessage
            error={errors.trackPrimary}
            id={`${trackPrimaryId}-error`}
          />
        </div>

        <div>
          <label htmlFor={trackSecondaryId} className="text-sm font-bold">
            希望トラック（第2希望） <span className="text-g-red">*</span>
          </label>
          <select
            id={trackSecondaryId}
            defaultValue=""
            aria-invalid={!!errors.trackSecondary}
            aria-describedby={
              errors.trackSecondary ? `${trackSecondaryId}-error` : undefined
            }
            className="mt-2 w-full rounded-lg border border-rule bg-white px-4 py-2.5 text-sm outline-none focus:border-g-blue"
            {...register("trackSecondary")}
          >
            <option value="" disabled>
              選択してください
            </option>
            {trackOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <FieldErrorMessage
            error={errors.trackSecondary}
            id={`${trackSecondaryId}-error`}
          />
        </div>
      </div>
      <p className="-mt-4 text-xs text-foreground-soft">
        希望者数に偏りがある場合、第2希望のトラックへ割り当てる可能性があります。
      </p>

      <fieldset>
        <legend className="text-sm font-bold">
          2. 希望する役割（参考・複数選択）
          <span className="text-g-red"> *</span>
        </legend>
        <div
          className="mt-2 grid gap-2 sm:grid-cols-2"
          aria-invalid={!!errors.rolePreference}
          aria-describedby={
            errors.rolePreference ? `${roleId}-error` : undefined
          }
        >
          {roleOptions.map((opt) => (
            <label key={opt.value} className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                value={opt.value}
                className="mt-0.5 accent-[color:var(--g-blue)]"
                {...register("rolePreference")}
              />
              {opt.label}
            </label>
          ))}
        </div>
        <FieldErrorMessage
          error={errors.rolePreference}
          id={`${roleId}-error`}
        />
      </fieldset>

      <fieldset>
        <legend className="text-sm font-bold">
          3. UI/UX・デザインへの関心 <span className="text-g-red">*</span>
        </legend>
        <div className="mt-2 flex flex-col gap-2">
          {uiuxInterestOptions.map((opt) => (
            <label key={opt.value} className="flex items-start gap-2 text-sm">
              <input
                type="radio"
                value={opt.value}
                className="mt-0.5 accent-[color:var(--g-blue)]"
                {...register("uiuxInterest")}
              />
              {opt.label}
            </label>
          ))}
        </div>
        <FieldErrorMessage
          error={errors.uiuxInterest}
          id={`${uiuxInterestId}-error`}
        />
      </fieldset>

      <div>
        <label htmlFor={experienceLevelId} className="text-sm font-bold">
          4. 開発・制作経験 <span className="text-g-red">*</span>
        </label>
        <select
          id={experienceLevelId}
          defaultValue=""
          aria-invalid={!!errors.experienceLevel}
          className="mt-2 w-full rounded-lg border border-rule bg-white px-4 py-2.5 text-sm outline-none focus:border-g-blue"
          {...register("experienceLevel")}
        >
          <option value="" disabled>
            選択してください
          </option>
          {experienceLevelOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <FieldErrorMessage
          error={errors.experienceLevel}
          id={`${experienceLevelId}-error`}
        />
      </div>

      <div>
        <label htmlFor={hackathonExperienceId} className="text-sm font-bold">
          5. ハッカソン参加経験
        </label>
        <select
          id={hackathonExperienceId}
          defaultValue=""
          className="mt-2 w-full rounded-lg border border-rule bg-white px-4 py-2.5 text-sm outline-none focus:border-g-blue"
          {...register("hackathonExperience")}
        >
          <option value="">選択してください</option>
          {hackathonExperienceOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className="text-sm font-bold">
          6. 希望するチーム構成 <span className="text-g-red">*</span>
        </legend>
        <div className="mt-2 flex flex-col gap-2">
          {teamPreferenceOptions.map((opt) => (
            <label key={opt.value} className="flex items-start gap-2 text-sm">
              <input
                type="radio"
                value={opt.value}
                className="mt-0.5 accent-[color:var(--g-blue)]"
                {...register("teamPreference")}
              />
              {opt.label}
            </label>
          ))}
        </div>
        <FieldErrorMessage
          error={errors.teamPreference}
          id={`${teamPreferenceId}-error`}
        />
        <p className="mt-2 text-xs text-foreground-soft">
          希望どおりの編成を保証するものではありません。
        </p>
      </fieldset>

      <div>
        <label htmlFor={teammateRequestId} className="text-sm font-bold">
          7. 一緒のチームを希望する人
        </label>
        <p className="mt-1 text-xs text-foreground-soft">
          希望する相手のユーザー名・ニックネームを入力してください。希望は考慮しますが、同じチームになることを保証するものではありません。
        </p>
        <input
          id={teammateRequestId}
          type="text"
          maxLength={200}
          className="mt-2 w-full rounded-lg border border-rule bg-white px-4 py-2.5 text-sm outline-none focus:border-g-blue"
          {...register("teammateRequest")}
        />
        <FieldErrorMessage
          error={errors.teammateRequest}
          id={`${teammateRequestId}-error`}
        />
      </div>

      <div>
        <label htmlFor={shuttleBusId} className="text-sm font-bold">
          8. シャトルバス利用希望 <span className="text-g-red">*</span>
        </label>
        <p className="mt-1 text-xs text-foreground-soft">
          希望調査です。各路線の運行を保証するものではありません。
        </p>
        <select
          id={shuttleBusId}
          defaultValue=""
          aria-invalid={!!errors.shuttleBus}
          className="mt-2 w-full rounded-lg border border-rule bg-white px-4 py-2.5 text-sm outline-none focus:border-g-blue"
          {...register("shuttleBus")}
        >
          <option value="" disabled>
            選択してください
          </option>
          {shuttleBusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <FieldErrorMessage
          error={errors.shuttleBus}
          id={`${shuttleBusId}-error`}
        />
      </div>

      <fieldset>
        <legend className="text-sm font-bold">
          9. 食物アレルギーの有無 <span className="text-g-red">*</span>
        </legend>
        <div className="mt-2 flex gap-6">
          {foodAllergyOptions.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                value={opt.value}
                className="accent-[color:var(--g-blue)]"
                {...register("foodAllergy")}
              />
              {opt.label}
            </label>
          ))}
        </div>
        <FieldErrorMessage
          error={errors.foodAllergy}
          id={`${foodAllergyId}-error`}
        />
        {foodAllergy === "yes" ? (
          <div className="mt-3">
            <label htmlFor={foodAllergyDetailId} className="text-xs font-bold">
              アレルギーの原因となる食品・必要な対応
            </label>
            <textarea
              id={foodAllergyDetailId}
              rows={2}
              maxLength={300}
              aria-invalid={!!errors.foodAllergyDetail}
              className="mt-2 w-full resize-y rounded-lg border border-rule bg-white px-4 py-2.5 text-sm outline-none focus:border-g-blue"
              {...register("foodAllergyDetail")}
            />
            <FieldErrorMessage
              error={errors.foodAllergyDetail}
              id={`${foodAllergyDetailId}-error`}
            />
          </div>
        ) : null}
      </fieldset>

      <div>
        <label htmlFor={accessibilityNeedsId} className="text-sm font-bold">
          10. 必要な配慮・アクセシビリティ
        </label>
        <p className="mt-1 text-xs text-foreground-soft">
          車いす利用、聴覚・視覚上の配慮、休憩場所など、参加に必要な配慮を入力してください。
        </p>
        <textarea
          id={accessibilityNeedsId}
          rows={3}
          maxLength={500}
          className="mt-2 w-full resize-y rounded-lg border border-rule bg-white px-4 py-2.5 text-sm outline-none focus:border-g-blue"
          {...register("accessibilityNeeds")}
        />
        <FieldErrorMessage
          error={errors.accessibilityNeeds}
          id={`${accessibilityNeedsId}-error`}
        />
      </div>

      <div>
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            id={teamConsentId}
            aria-invalid={!!errors.teamConsent}
            className="mt-1 accent-[color:var(--g-blue)]"
            {...register("teamConsent")}
          />
          <span>
            11.
            ユーザー名・ニックネームをチーム発表およびチームメンバーへの連絡に使用することに同意する
            <span className="text-g-red"> *</span>
          </span>
        </label>
        <FieldErrorMessage
          error={errors.teamConsent}
          id={`${teamConsentId}-error`}
        />
      </div>

      <div>
        <label htmlFor={remarksId} className="text-sm font-bold">
          12. 備考
        </label>
        <p className="mt-1 text-xs text-foreground-soft">
          チーム編成や参加に関して、運営へ伝えておきたい事項があればご記入ください。
        </p>
        <textarea
          id={remarksId}
          rows={3}
          maxLength={500}
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
        {isSubmitting ? "送信中..." : "この内容で第二部に応募する"}
      </button>
    </form>
  );
}
