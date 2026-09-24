import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import { highlights } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "サミットについて",
  description:
    "CivicAI Summit 2027 は、CivicTech × AI/LLMでまちの課題に挑むイベントです。主催GDGoC KITについてもご紹介します。",
};

export default function AboutPage() {
  return (
    <div className="pb-20">
      <PageHeader eyebrow="概要" title="CivicTech × AI/LLMで、まちの課題に挑む" />
      <div className="mx-auto max-w-5xl px-6">
        <p className="mt-6 text-foreground-soft">
          少子高齢化、担い手不足、激甚化する自然災害、環境問題、福祉や教育の格差など、地方都市は多様で複雑な課題に直面しています。CivicAI
          Summit
          は、市民自身が主体となって技術を活用する「CivicTech」に、Googleの先進的な「AI/LLM技術」を掛け合わせ、社会や身近な生活をアップデートするプロダクトの創出と、次世代のエキスパート人材育成を目指すイベントです。
        </p>
        <p className="mt-4 text-foreground-soft">
          主催の GDGoC KIT は、Google
          Developersのサポートを受けながら活動する、北陸で唯一のGDGoCチャプターです。2023年10月の発足以来、学内外で継続的にイベントを開催しており、直近では178名規模のセッションを運営した実績があります。
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-rule bg-card p-6">
            <h2 className="font-display font-bold">GDGoCとは</h2>
            <p className="mt-2 text-sm text-foreground-soft">
              GDGoC（Google Developer Groups on
              Campus、旧称：GDSC）は、Googleの技術やプロダクトに関心を持つ学生が中心となって、世界中の大学キャンパスで自主的に運営するコミュニティです。Google
              Developersによる技術サポートやガイドラインの提供を受けていますが、Google社が直接運営・管理する組織ではなく、各チャプターは学生主体で独立して活動しています。GDGoC
              KITはその北陸で唯一のチャプターです。
            </p>
            <p className="mt-2 text-xs text-foreground-soft">
              ※
              本イベント（CivicAI
              Summit）はGDGoC
              KITが企画・主催する独自のイベントであり、Google社が主催・運営・後援するものではありません。
            </p>
          </div>
          <div className="rounded-2xl border border-rule bg-card p-6">
            <h2 className="font-display font-bold">CivicTechとは</h2>
            <p className="mt-2 text-sm text-foreground-soft">
              CivicTech（シビックテック）とは、市民が主体となってテクノロジーを活用し、行政サービスや地域社会が抱える課題の解決に取り組む活動を指す言葉です。エンジニアやデザイナーに限らず、多様な立場の人が技術を通じて「まちをより良くする」ことを目指す、世界的に広がりつつある取り組みです。
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-rule bg-card p-6"
            >
              <h2 className="font-display font-bold">{item.title}</h2>
              <p className="mt-2 text-sm text-foreground-soft">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
