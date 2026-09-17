export default function PreRegistrationsPanel({
  emails,
}: {
  emails: string[];
}) {
  return (
    <div className="rounded-2xl border border-rule bg-card p-6">
      <p className="font-display font-bold">
        事前登録一覧（{emails.length}件）
      </p>
      <p className="mt-2 text-sm text-foreground-soft">
        申込み開始時に、団体アドレスから以下の宛先へ手動でご連絡ください（自動送信はされません）。下のテキストをコピーして、メールソフトのBcc欄等にご利用いただけます。
      </p>
      <textarea
        readOnly
        rows={4}
        value={emails.join(", ")}
        className="mt-4 w-full resize-y rounded-lg border border-rule bg-white px-3 py-2 font-mono text-xs outline-none focus:border-g-blue"
      />
      {emails.length === 0 ? (
        <p className="mt-2 text-xs text-foreground-soft">
          まだ事前登録はありません。
        </p>
      ) : null}
    </div>
  );
}
