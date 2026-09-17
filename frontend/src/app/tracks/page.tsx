import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import { tracks } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "募集テーマ",
  description:
    "CivicAI Summit 2027 ハッカソンの4トラック（防災・安全／シビック・アクセシビリティ／ローカルカルチャー＆コミュニティエコノミー／グリーン＆スマートシティ）と大会レギュレーション。",
};

export default function TracksPage() {
  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="募集テーマ"
        title="ハッカソン募集テーマ（4トラック）"
        description="参加チームは以下から1トラックを選択し、AI/LLMを活用したWebアプリ・プロトタイプを開発します。Google製品・技術（Gemini API、Vertex AI、Firebaseなど）を最低1つコア機能に組み込むことが大会レギュレーションで、それ以外の技術選定や他社AI APIとの併用は自由です。"
      />
      <div className="mx-auto max-w-5xl px-6">
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {tracks.map((track) => (
            <div
              key={track.name}
              className="rounded-2xl border border-rule bg-card p-6"
            >
              <p className="font-mono text-xs text-g-blue">{track.en}</p>
              <h2 className="mt-1 whitespace-pre-line font-display font-bold">
                {track.name}
              </h2>
              <p className="mt-2 text-sm text-foreground-soft">
                {track.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
