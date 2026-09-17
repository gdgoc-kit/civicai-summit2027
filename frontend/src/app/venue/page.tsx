import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/page-header";
import { venue } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "会場",
  description:
    "CivicAI Summit 2027 は石川県地場産業振興センター（石川県金沢市）での開催を予定しています。会場・アクセス・地図はこちら。",
};

export default function VenuePage() {
  const mapQuery = encodeURIComponent(`${venue.name} ${venue.address}`);

  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="会場"
        title={venue.name}
        description={`${venue.area}での開催を予定しています。`}
        descriptionMaxWidthClassName="max-w-none"
      />
      <div className="mx-auto max-w-5xl px-6">
        {/* 会場について */}
        <section className="mt-10">
          <h2 className="font-display text-2xl font-extrabold">
            {venue.name}とは
          </h2>
          <p className="mt-3 text-sm text-foreground-soft">
            {venue.description}
          </p>
          <a
            href={venue.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm font-bold text-g-blue hover:underline"
          >
            施設公式サイトを見る ↗
          </a>
        </section>

        {/* 所在地・アクセス */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-extrabold">
            所在地・アクセス
          </h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="rounded-2xl border border-rule bg-card p-6">
                <p className="text-xs text-foreground-soft">住所</p>
                <p className="mt-1 font-bold">
                  {venue.postalCode} {venue.address}
                </p>
                <p className="mt-4 text-xs text-foreground-soft">電話番号</p>
                <p className="mt-1 font-bold">{venue.tel}</p>
              </div>
              <div className="rounded-2xl border border-g-red/30 bg-g-red/5 p-6">
                <p className="text-sm font-bold text-g-red">
                  ※
                  上記の電話番号・施設公式サイトへ、本イベントに関するお問い合わせを直接行うことは絶対にお控えください。
                </p>
                <p className="mt-2 text-sm text-foreground-soft">
                  会場は施設を借用しているのみで、CivicAI Summit
                  2027の運営とは別の組織です。本イベントに関するお問い合わせは、必ず運営（GDGoC
                  KIT）までお願いします。
                </p>
                <Link
                  href="/contact"
                  className="mt-3 inline-block text-sm font-bold text-g-blue hover:underline"
                >
                  お問い合わせページへ →
                </Link>
              </div>
              <div className="rounded-2xl border border-rule bg-card p-6">
                <p className="text-xs text-foreground-soft">
                  公共交通機関でのアクセス
                </p>
                <ul className="mt-3 space-y-4">
                  {venue.access.map((item) => (
                    <li key={item.method}>
                      <p className="text-sm font-bold text-g-blue">
                        {item.method}
                      </p>
                      <p className="mt-1 text-sm text-foreground-soft">
                        {item.detail}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-rule">
              <iframe
                title={`${venue.name}の地図`}
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                className="aspect-square w-full lg:aspect-auto lg:h-full"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          <p className="mt-6 text-sm text-foreground-soft">
            会場へのアクセス支援として、金沢駅・富山駅発着のシャトルバス運行を予定しています（申込状況・協賛状況により福井駅便の追加を検討中）。
          </p>
        </section>
      </div>
    </div>
  );
}
