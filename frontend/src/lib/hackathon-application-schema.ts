import { z } from "zod";
import { tracks } from "@/lib/site-content";

const trackSlugs = tracks.map((t) => t.slug) as [string, ...string[]];

export const trackOptions = tracks.map((t) => ({
  value: t.slug,
  label: t.shortLabel,
}));

export const roleOptions = [
  { value: "frontend", label: "フロントエンド" },
  { value: "backend", label: "バックエンド" },
  { value: "mobile", label: "モバイルアプリ" },
  { value: "ai", label: "AI・機械学習" },
  { value: "cloud", label: "クラウド・インフラ" },
  { value: "design", label: "UI/UX・デザイン" },
  { value: "planning", label: "企画・アイデア設計" },
  { value: "data", label: "データ分析・GIS" },
  { value: "presentation", label: "発表・プレゼンテーション" },
  { value: "materials", label: "資料作成" },
  { value: "undecided", label: "特に決めていない" },
  { value: "challenge", label: "未経験だが新しい役割へ挑戦したい" },
  { value: "other", label: "その他" },
] as const;

export const uiuxInterestOptions = [
  { value: "experiencedLead", label: "経験があり、主担当として取り組みたい" },
  {
    value: "experiencedOther",
    label: "経験はあるが、ほかの役割を主に担当したい",
  },
  { value: "beginnerTry", label: "未経験だが挑戦してみたい" },
  { value: "support", label: "補助的に関わりたい" },
  { value: "none", label: "希望しない" },
] as const;

export const experienceLevelOptions = [
  { value: "none", label: "未経験" },
  { value: "underOne", label: "1年未満" },
  { value: "oneToThree", label: "1年以上3年未満" },
  { value: "overThree", label: "3年以上" },
] as const;

export const hackathonExperienceOptions = [
  { value: "first", label: "初参加" },
  { value: "oneOrTwo", label: "1〜2回" },
  { value: "threeOrMore", label: "3回以上" },
] as const;

export const teamPreferenceOptions = [
  { value: "mixed", label: "経験者と初心者が混ざったチーム" },
  { value: "moreExperienced", label: "経験者が比較的多いチーム" },
  { value: "moreBeginners", label: "初心者が比較的多いチーム" },
  { value: "noPreference", label: "特に希望しない" },
] as const;

export const shuttleBusOptions = [
  { value: "kanazawa", label: "金沢駅発着" },
  { value: "toyama", label: "富山駅発着" },
  { value: "fukui", label: "福井駅発着" },
  { value: "none", label: "利用しない" },
  { value: "undecided", label: "現時点では未定" },
] as const;

export const foodAllergyOptions = [
  { value: "none", label: "なし" },
  { value: "yes", label: "あり" },
] as const;

export const quotaOptions = [
  {
    value: "studentPriority",
    label: "学生優先枠（105名・先着順）",
    description: "北陸地域の学校に所属する学生（社会人学生を除く）が対象です。",
  },
  {
    value: "studentGeneral",
    label: "学生・社会人枠（45名・抽選）",
    description: "北陸地域の学校・企業・組織に所属する学生および社会人が対象です。",
  },
] as const;

export const hackathonApplicationSchema = z
  .object({
    quota: z.enum(["studentPriority", "studentGeneral"], {
      message: "申込み枠を選択してください",
    }),
    trackPrimary: z.enum(trackSlugs, { message: "第1希望のトラックを選択してください" }),
    trackSecondary: z.enum(trackSlugs, {
      message: "第2希望のトラックを選択してください",
    }),
    rolePreference: z
      .array(z.enum(roleOptions.map((o) => o.value) as [string, ...string[]]))
      .min(1, "希望する役割を1つ以上選択してください"),
    uiuxInterest: z.enum(
      uiuxInterestOptions.map((o) => o.value) as [string, ...string[]],
      { message: "UI/UX・デザインへの関心を選択してください" },
    ),
    experienceLevel: z.enum(
      experienceLevelOptions.map((o) => o.value) as [string, ...string[]],
      { message: "開発・制作経験を選択してください" },
    ),
    hackathonExperience: z
      .enum(hackathonExperienceOptions.map((o) => o.value) as [string, ...string[]])
      .optional()
      .or(z.literal("")),
    teamPreference: z.enum(
      teamPreferenceOptions.map((o) => o.value) as [string, ...string[]],
      { message: "希望するチーム構成を選択してください" },
    ),
    teammateRequest: z
      .string()
      .trim()
      .max(200, "200文字以内で入力してください")
      .optional()
      .or(z.literal("")),
    shuttleBus: z.enum(
      shuttleBusOptions.map((o) => o.value) as [string, ...string[]],
      { message: "シャトルバス利用希望を選択してください" },
    ),
    foodAllergy: z.enum(
      foodAllergyOptions.map((o) => o.value) as [string, ...string[]],
      { message: "食物アレルギーの有無を選択してください" },
    ),
    foodAllergyDetail: z
      .string()
      .trim()
      .max(300, "300文字以内で入力してください")
      .optional()
      .or(z.literal("")),
    accessibilityNeeds: z
      .string()
      .trim()
      .max(500, "500文字以内で入力してください")
      .optional()
      .or(z.literal("")),
    teamConsent: z.literal(true, {
      message: "チーム編成・連絡に関する同意が必要です",
    }),
    remarks: z
      .string()
      .trim()
      .max(500, "500文字以内で入力してください")
      .optional()
      .or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.trackPrimary === data.trackSecondary) {
      ctx.addIssue({
        code: "custom",
        path: ["trackSecondary"],
        message: "第1希望と異なるトラックを選択してください",
      });
    }
    if (data.foodAllergy === "yes" && !data.foodAllergyDetail) {
      ctx.addIssue({
        code: "custom",
        path: ["foodAllergyDetail"],
        message: "アレルギーの原因となる食品や必要な対応を入力してください",
      });
    }
  });

export type HackathonApplicationInput = z.infer<
  typeof hackathonApplicationSchema
>;
