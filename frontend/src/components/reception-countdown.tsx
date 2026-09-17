import CountdownTimer from "@/components/countdown-timer";
import type { ReceptionStatus } from "@/lib/reception-window";

export default function ReceptionCountdown({
  status,
  startsAt,
  endsAt,
  audienceLabel,
}: {
  status: ReceptionStatus;
  startsAt: string | null;
  endsAt: string | null;
  audienceLabel?: string;
}) {
  const prefix = audienceLabel ? `${audienceLabel}：` : "";
  if (status === "before" && startsAt) {
    return <CountdownTimer label={`${prefix}募集開始まで`} targetDate={startsAt} />;
  }
  if (status === "open" && endsAt) {
    return <CountdownTimer label={`${prefix}募集終了まで`} targetDate={endsAt} />;
  }
  return null;
}
