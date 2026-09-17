import Link from "next/link";

export default function PostSubmitNav() {
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-3">
      <Link
        href="/"
        className="rounded-full border border-rule px-5 py-2 text-sm font-bold text-foreground transition-colors hover:border-g-blue hover:text-g-blue"
      >
        ホームへ戻る
      </Link>
      <Link
        href="/mypage"
        className="rounded-full border border-g-blue px-5 py-2 text-sm font-bold text-g-blue transition-colors hover:bg-g-blue hover:text-white"
      >
        マイページへ
      </Link>
    </div>
  );
}
