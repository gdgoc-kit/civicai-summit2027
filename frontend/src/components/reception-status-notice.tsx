import { formatDateTimeJa } from "@/lib/reception-window";

export default function ReceptionStatusNotice({
  status,
  startsAt,
  endsAt,
}: {
  status: "before" | "closed";
  startsAt: string | null;
  endsAt: string | null;
}) {
  const startsLabel = formatDateTimeJa(startsAt);
  const endsLabel = formatDateTimeJa(endsAt);

  return (
    <div className="rounded-2xl border border-rule bg-card p-8 text-center">
      <p className="text-sm text-foreground-soft">
        {status === "before" ? (
          <>
            受付開始前です。
            {startsLabel ? (
              <>
                <br />
                受付開始予定：{startsLabel}
              </>
            ) : null}
          </>
        ) : (
          <>
            受付は終了しました。
            {endsLabel ? (
              <>
                <br />
                受付終了日時：{endsLabel}
              </>
            ) : null}
          </>
        )}
      </p>
    </div>
  );
}
