export default function PreRegisterButton({
  email,
}: {
  userId: string;
  email: string;
}) {
  return (
    <div className="rounded-2xl border border-rule bg-card p-6 text-center">
      <p className="text-sm text-foreground-soft">
        事前登録いただくと、申込み開始時に kit@gdgoc.jp より {email} 宛へご連絡します。
      </p>
      <button
        type="button"
        disabled
        className="mt-4 w-full cursor-not-allowed rounded-full bg-gray-500 px-7 py-3 text-sm font-bold text-white opacity-60 sm:w-auto"
      >
        事前登録する
      </button>
    </div>
  );
}
