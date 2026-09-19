import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-rule bg-card">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-10 text-sm text-foreground-soft">
        <p className="font-display font-bold text-foreground">
          CivicAI Summit 2027
        </p>
        <p>
          主催: GDGoC KIT（Google Developer Groups on Campus 
          Kanazawa Institute of Technology）
        </p>
        <nav className="flex flex-wrap gap-4 font-mono text-[13px]">
          <Link href="/mypage" className="hover:text-g-blue">
            マイページ
          </Link>
          <Link href="/news" className="hover:text-g-blue">
            お知らせ
          </Link>
          <Link href="/contact" className="hover:text-g-blue">
            お問い合わせ
          </Link>
          <Link href="/privacy" className="hover:text-g-blue">
            個人情報の取扱方針
          </Link>
          <a
            href="https://gdgoc-kit.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-g-blue"
          >
            GDGoC KIT 公式サイト
          </a>
          <a
            href="https://x.com/kit_gdsc"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-g-blue"
          >
            公式X
          </a>
        </nav>
        <p className="text-xs text-foreground-soft">
          &copy; {new Date().getFullYear()} GDGoC KIT
        </p>
      </div>
    </footer>
  );
}
