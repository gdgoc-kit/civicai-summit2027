import type { Metadata } from "next";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "個人情報の取扱方針",
  description:
    "CivicAI Summit 2027 における参加者の個人情報の取扱方針です。",
};

interface PrivacySection {
  heading: string;
  body: string;
}

const PRIVACY_SECTIONS: readonly PrivacySection[] = [
  {
    heading: "1. 取得する情報",
    body: "氏名、ユーザー名・ニックネーム、所属先、所属先の所在地、メールアドレスなど、参加登録および各プログラムの応募時にご入力いただく情報を取得します。",
  },
  {
    heading: "2. 利用目的",
    body: "イベント運営（参加受付、抽選、チーム編成、各種事前連絡、当日の案内連絡）、参加者数の把握、今後の企画運営の参考とする目的で利用します。また、登録時に希望された方に限り、協賛企業・団体等からの採用・インターンシップ情報やイベント案内等の情報提供（運営からの代理配信を含む）を行う場合があります。それら以外の目的外利用は行いません。",
  },
  {
    heading: "3. 第三者提供",
    body: "法令に基づく場合、および参加登録時にご本人の事前の同意（協賛企業からの情報提供の希望選択など）を得た場合を除き、ご本人の同意なく個人情報を第三者へ提供することはありません。",
  },
  {
    heading: "4. 写真・映像の取扱い",
    body: "参加登録時にご選択いただいた撮影および広報利用に関する同意内容に基づき、公式サイトや公式SNS等での掲載可否を判断・管理します。",
  },
  {
    heading: "5. 保管・削除",
    body: "取得した個人情報は、運営に必要な期間のみ安全に保管したのち、適切に破棄します。なお、マイページよりいつでも登録内容の確認・変更およびキャンセル（登録削除）が可能です。",
  },
  {
    heading: "6. お問い合わせ窓口",
    body: "個人情報の取扱いに関するご質問やお問い合わせは、主催団体である GDGoC KIT までご連絡ください。",
  },
] as const;

export default function PrivacyPage() {
  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="ポリシー"
        title="個人情報の取扱方針"
        maxWidthClassName="max-w-2xl"
      />
      <div className="mx-auto max-w-2xl px-6">
        <p className="mt-4 text-sm leading-relaxed text-foreground-soft">
          CivicAI Summit 2027（主催: GDGoC KIT）は、参加者の個人情報を以下の方針に基づき適切に取り扱います。
        </p>

        <div className="mt-8 space-y-6">
          {PRIVACY_SECTIONS.map((section) => (
            <section key={section.heading} className="space-y-1">
              <h2 className="font-display text-base font-bold text-foreground">
                {section.heading}
              </h2>
              <p className="text-sm leading-relaxed text-foreground-soft">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <p className="mt-10 border-t border-rule pt-6 text-xs text-foreground-soft">
          ※ このページの内容は現時点での予告・仮方針です。正式版が確定次第、本ページを更新してお知らせします。
        </p>
      </div>
    </div>
  );
}