export type ReceptionStatus = "before" | "open" | "closed";

export function getReceptionStatus(
  startsAt: string | null,
  endsAt: string | null,
  now: Date = new Date(),
): ReceptionStatus {
  // 開始・終了とも未設定の場合は、誤って常時受付状態にならないよう「開始前」として扱う。
  if (!startsAt && !endsAt) {
    return "before";
  }
  if (startsAt && now.getTime() < new Date(startsAt).getTime()) {
    return "before";
  }
  if (endsAt && now.getTime() > new Date(endsAt).getTime()) {
    return "closed";
  }
  return "open";
}

export function formatDateTimeJa(value: string | null): string | null {
  if (!value) return null;
  return new Date(value).toLocaleString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
