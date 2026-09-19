import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/page-header";
import {
  communityPartnerIdeas,
  sponsorFundingPlans,
  sponsorGoodsCategories,
  sponsorIndividualCategories,
  sponsorPartnerBenefits,
  sponsorPartnerCooperations,
  specialSponsorshipCategories,
} from "@/lib/site-content";

export const metadata: Metadata = {
  title: "協賛について",
  description:
    "CivicAI Summit 2027 では、資金協賛・物品協賛・CivicTechパートナー・個別協賛など、さまざまな形での協賛を募集しています。",
};

export default function SponsorsPage() {
  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="協賛"
        title="協賛企業・団体の皆さまへ"
        description="CivicAI Summit 2027では、基本プランに各種オプションを追加する資金協賛のほか、物品協賛、CivicTechパートナー、個別協賛など、さまざまな形での協賛を募集しています。次世代の技術人材との接点や、地域における新しいブランディングの機会として、ぜひご検討ください。"
        descriptionMaxWidthClassName="max-w-none"
      />

      <div className="mx-auto max-w-5xl px-6">
        {/* 資金協賛 */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-extrabold">資金協賛</h2>
          <p className="mt-3 text-sm text-foreground-soft">
            基本プランに各種オプションを追加していただく形式で、資金協賛を募集します。各プランに記載している内容は任意でご利用いただける特典で、すべての特典を利用する必要はありません。オプションは、基本プランへの申し込みが前提となります。
          </p>
          <div className="mt-6 divide-y divide-rule rounded-2xl border border-rule bg-card">
            {sponsorFundingPlans.map((plan) => (
              <div
                key={plan.name}
                className="flex flex-col gap-2 p-6 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
              >
                <div className="sm:max-w-md">
                  <h3 className="font-display font-bold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-foreground-soft">
                    {plan.content}
                  </p>
                </div>
                <p className="whitespace-pre-line text-sm font-bold text-g-blue sm:shrink-0 sm:text-right">
                  {plan.price}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-foreground-soft">
            ※
            各プランおよびオプションには受付上限があります。申込状況や当日のプログラム構成により、ご希望に添えない場合があります。掲載物・CM動画・スポンサーLT等の内容は、事前に運営による確認をおこないます。
          </p>
        </section>

        {/* 物品協賛 */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-extrabold">物品協賛</h2>
          <p className="mt-3 text-sm text-foreground-soft">
            資金協賛とは別に、イベントで使用する物品や参加者・受賞チームへ配布する物品の提供を募集します。物品協力のみでの参加も可能です。
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {sponsorGoodsCategories.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border border-rule bg-card p-6"
              >
                <h3 className="font-display font-bold">{item.name}</h3>
                <p className="mt-2 text-sm text-foreground-soft">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CivicTechパートナー */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-extrabold">
            CivicTechパートナー
          </h2>
          <p className="mt-3 text-sm text-foreground-soft">
            地域課題に関する知見、データ、活動事例、人的ネットワーク等の提供を通じて、本イベントの企画・運営に協力いただく企業・団体向けのパートナー制度です。CivicTechや地域課題の解決に取り組む企業、自治体、教育・研究機関、非営利団体、地域コミュニティ等を対象とします。
          </p>
          <p className="mt-2 text-sm font-bold text-foreground-soft">
            金銭的な協賛・物品提供は不要な一方、運営からの依頼または個別の審査・協議によって参加いただく企業・団体を決定する「審査制・依頼制」のパートナーシップです。
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-rule bg-card p-6">
              <h3 className="font-display font-bold">主な協力内容</h3>
              <ul className="mt-3 space-y-2 text-sm text-foreground-soft">
                {sponsorPartnerCooperations.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-g-blue">・</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-rule bg-card p-6">
              <h3 className="font-display font-bold">パートナー特典</h3>
              <ul className="mt-3 space-y-2 text-sm text-foreground-soft">
                {sponsorPartnerBenefits.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-g-blue">・</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-3 text-xs text-foreground-soft">
            ※
            すべての項目への協力を求めるものではありません。具体的な協力内容は、各企業・団体と運営との協議により決定します。
          </p>
        </section>

        {/* 技術系コミュニティパートナー */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-extrabold">
            技術系コミュニティパートナー
          </h2>
          <p className="mt-3 text-sm text-foreground-soft">
            他の技術コミュニティ・勉強会・ユーザーグループ等との相互協力を想定したパートナー枠です。詳細は現時点で未定ですが、次のような内容を検討しています。
          </p>
          <div className="mt-6 rounded-2xl border border-rule bg-card p-6">
            <h3 className="font-display font-bold">
              想定している内容（検討中）
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-foreground-soft">
              {communityPartnerIdeas.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-g-blue">・</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-3 text-xs text-foreground-soft">
            ※
            内容は未定です。詳細が決まり次第、本ページで案内します。ご興味のあるコミュニティ・団体の方は、
            <Link
              href="/contact"
              className="font-bold text-g-blue hover:underline"
            >
              お問い合わせ
            </Link>
            ください。
          </p>
        </section>

        {/* 個別協賛 */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-extrabold">個別協賛</h2>
          <p className="mt-3 text-sm text-foreground-soft">
            資金協賛および物品協力に加えて、イベントの実施に必要な通信環境、交通、飲食、廃棄物処理等をご支援いただく個別協賛を募集します。物品・サービスの無償提供のほか、費用の一部負担や通常料金からの割引による支援も可能です。協賛金額・提供内容・募集枠は、個別に協議のうえ決定します。
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {sponsorIndividualCategories.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border border-rule bg-card p-6"
              >
                <h3 className="font-display font-bold">{item.name}</h3>
                <p className="mt-2 text-sm text-foreground-soft">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 特別協賛枠 */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-extrabold">特別協賛枠</h2>
          <p className="mt-3 text-sm text-foreground-soft">
            資金協賛および物品協力に加えて、イベントの実施に必要な通信環境、交通、飲食、廃棄物処理等をご支援いただく個別協賛を募集します。物品・サービスの無償提供のほか、費用の一部負担や通常料金からの割引による支援も可能です。協賛金額・提供内容・募集枠は、個別に協議のうえ決定します。
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {specialSponsorshipCategories.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border border-rule bg-card p-6"
              >
                <h3 className="font-display font-bold">{item.name}</h3>
                <p className="mt-2 text-sm text-foreground-soft">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* お申し込み・お問い合わせ */}
        <section className="mt-14 rounded-2xl border border-rule bg-card p-8">
          <h2 className="font-display text-2xl font-extrabold">
            お申し込み・お問い合わせ
          </h2>
          <p className="mt-3 text-sm text-foreground-soft">
            お支払いは銀行振り込みを予定しています。請求書の発行元および振込先は、正式なお申し込み時にご案内します。請求・支払時期は、協賛内容の確定後に個別にご案内します。
          </p>
          <p className="mt-4 text-sm text-foreground-soft">
            資金協賛・物品協力・CivicTechパートナーに関するご相談は、以下の窓口までお問い合わせください。
          </p>
          <p className="mt-2 text-sm font-bold">
            GDGoC KIT　CivicAI Summit 2027運営チーム
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="mailto:gdgockit-sponsor@lifecore.jp"
              className="inline-block rounded-full bg-g-blue px-7 py-3 text-sm font-bold text-white transition-colors hover:opacity-90"
            >
              メールで問い合わせる
            </a>
            <a
              href="https://x.com/kit_gdsc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full border border-g-blue px-7 py-3 text-sm font-bold text-g-blue transition-colors hover:bg-g-blue hover:text-white"
            >
              Xで問い合わせる
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
