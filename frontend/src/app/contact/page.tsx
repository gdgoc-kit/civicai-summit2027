import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "CivicAI Summit 2027 に関するお問い合わせ窓口です。",
};

export default function ContactPage() {
  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="お問い合わせ"
        title="お問い合わせ"
        description="CivicAI Summit 2027（主催：GDGoC KIT）に関するご質問・ご相談は、以下の窓口までお気軽にご連絡ください。"
        descriptionMaxWidthClassName="max-w-none"
      />
      <div className="mx-auto max-w-5xl px-6">
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-rule bg-card p-6">
            <h2 className="font-display font-bold">一般的なお問い合わせ</h2>
            <p className="mt-2 text-sm text-foreground-soft">
              イベント内容、参加方法など、その他のご質問はこちらへご連絡ください。
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="mailto:kit@gdgoc.jp"
                className="inline-block rounded-full bg-g-blue px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1a56c4]"
              >
                メールで問い合わせる
              </a>
              <a
                href="https://x.com/kit_gdsc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full border border-g-blue px-6 py-2.5 text-sm font-bold text-g-blue transition-colors hover:bg-g-blue hover:text-white"
              >
                Xで問い合わせる
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-rule bg-card p-6">
            <h2 className="font-display font-bold">協賛・物品協力について</h2>
            <p className="mt-2 text-sm text-foreground-soft">
              資金協賛・物品協賛・CivicTechパートナーに関するご相談は、協賛ページの窓口をご利用ください。
            </p>
            <Link
              href="/sponsors"
              className="mt-4 inline-block text-sm font-bold text-g-blue hover:underline"
            >
              協賛についてのページへ →
            </Link>
          </div>
        </div>

        <p className="mt-6 text-sm text-foreground-soft">
          参加費・参加対象・懇親会などのよくあるご質問は
          <Link href="/faq" className="font-bold text-g-blue hover:underline">
            よくある質問
          </Link>
          もあわせてご確認ください。
        </p>

        <p className="mt-10 text-xs text-foreground-soft">
          お問い合わせいただいた内容は、返信および対応のためにのみ使用します。取扱いの詳細は
          <Link
            href="/privacy"
            className="font-bold text-g-blue hover:underline"
          >
            個人情報の取扱方針
          </Link>
          をご確認ください。
        </p>
      </div>
    </div>
  );
}
