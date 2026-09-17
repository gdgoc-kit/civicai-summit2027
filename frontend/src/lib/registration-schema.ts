import { z } from "zod";

export const registrationSchema = z.object({
  attendeeType: z.enum(["student", "workingStudent", "professional", "other"], {
    message: "参加者区分を選択してください",
  }),
  name: z
    .string()
    .trim()
    .min(1, "氏名を入力してください")
    .max(100, "100文字以内で入力してください"),
  nickname: z
    .string()
    .trim()
    .min(1, "ユーザー名・ニックネームを入力してください")
    .max(50, "50文字以内で入力してください"),
  nicknameReading: z
    .string()
    .trim()
    .min(1, "ユーザー名・ニックネームの読み方を入力してください")
    .max(50, "50文字以内で入力してください"),
  affiliation: z
    .string()
    .trim()
    .min(1, "所属先を入力してください")
    .max(200, "200文字以内で入力してください"),
  affiliationArea: z.enum(
    ["ishikawa", "toyama", "fukui", "other"],
    { message: "所属先の所在地を選択してください" },
  ),
  mediaConsent: z.enum(["consent", "groupOnly", "individual"], {
    message: "写真・映像の撮影および広報利用について選択してください",
  }),
  privacyConsent: z.literal(true, {
    message: "個人情報の取扱方針への同意が必要です",
  }),
  accessibilityNotes: z
    .string()
    .trim()
    .max(500, "500文字以内で入力してください")
    .optional()
    .or(z.literal("")),
  remarks: z
    .string()
    .trim()
    .max(500, "500文字以内で入力してください")
    .optional()
    .or(z.literal("")),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

export const attendeeTypeOptions = [
  { value: "student", label: "学生" },
  { value: "workingStudent", label: "社会人学生" },
  { value: "professional", label: "社会人" },
  { value: "other", label: "その他" },
] as const;

export const affiliationAreaOptions = [
  { value: "ishikawa", label: "石川県" },
  { value: "toyama", label: "富山県" },
  { value: "fukui", label: "福井県" },
  { value: "other", label: "その他" },
] as const;

export const mediaConsentOptions = [
  { value: "consent", label: "撮影および広報媒体への掲載に同意する" },
  {
    value: "groupOnly",
    label:
      "集合写真は問題ないが、個人を中心に撮影した写真の掲載は希望しない",
  },
  { value: "individual", label: "撮影・掲載に関して個別の配慮を希望する" },
] as const;
