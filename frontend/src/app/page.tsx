import Link from "next/link";
import { stats, sitePages } from "@/lib/site-content";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: appSettings } = await supabase
    .from("app_settings")
    .select("home_banner_text, home_banner_href")
    .eq("id", 1)
    .maybeSingle();
  const bannerText = appSettings?.home_banner_text ?? null;
  const bannerHref = appSettings?.home_banner_href ?? null;

  return (
    <>
      {bannerText ? (
        <div className="border-b border-rule bg-g-green px-6 py-3 text-center text-sm font-bold text-white">
          {bannerHref ? (
            <Link href={bannerHref} className="hover:underline">
              {bannerText} →
            </Link>
          ) : (
            bannerText
          )}
        </div>
      ) : null}
      <section className="border-b border-rule bg-card">
        <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-g-blue">
            2027.09.18（土）- 19（日） ・ 石川県地場産業振興センター（金沢市）
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            CivicAI Summit 2027
          </h1>
          <p className="mt-6 max-w-xl text-base text-foreground-soft">
            AI・LLM技術で、地域課題を突破する。
            <br />
            学生・技術者・行政・企業が集う、産官学民オープンイノベーション。
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <span
              aria-disabled="true"
              className="pointer-events-none cursor-not-allowed rounded-full bg-gray-500 px-7 py-3 text-sm font-bold text-white"
            >
              参加登録はこちら
            </span>
            <Link
              href="/about"
              className="rounded-full border border-rule px-7 py-3 text-sm font-bold text-foreground transition-colors hover:border-g-blue hover:text-g-blue"
            >
              サミットについて
            </Link>
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-5">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="font-mono text-xs text-foreground-soft">
                  {stat.label}
                </dt>
                <dd className="mt-1 font-display text-xl font-extrabold text-g-blue">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-xs text-foreground-soft">
            ※ プログラム詳細は調整中です。確定次第このページを更新します。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20">
        <p className="font-mono text-xs font-medium uppercase tracking-widest text-g-blue">
          サイトマップ
        </p>
        <h2 className="mt-3 font-display text-2xl font-extrabold sm:text-3xl">
          サイト内のページ
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sitePages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="group rounded-2xl border border-rule bg-card p-6 transition-colors hover:border-g-blue"
            >
              <p className="font-mono text-xs text-g-blue">{page.label}</p>
              <h3 className="mt-2 font-display font-bold group-hover:text-g-blue">
                {page.title}
              </h3>
              <p className="mt-2 text-sm text-foreground-soft">
                {page.teaser}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-rule bg-g-blue">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 px-6 py-16 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-extrabold sm:text-2xl">
              CivicAI Summit 2027 に参加しませんか？
            </h2>
            <p className="mt-2 text-sm text-white/80">
              参加登録は1分ほどで完了します。
            </p>
          </div>
          <Link
            href="/register"
            className="shrink-0 rounded-full bg-white px-7 py-3 text-sm font-bold text-g-blue transition-colors hover:bg-white/90"
          >
            参加登録はこちら
          </Link>
        </div>
      </section>
    </>
  );
}
