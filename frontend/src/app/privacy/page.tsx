import type { Metadata } from "next";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "個人情報の取扱方針",
  description:
    "CivicAI Summit 2027 における参加者の個人情報の取扱方針です。",
};

const sections = [
  {
    heading: "1. 取得する情報",
    body: "氏名、ユーザー名・ニックネーム、所属先、所属先の所在地、メールアドレスなど、参加登録・各プログラムの応募時にご入力いただく情報を取得します。",
  },
  {
    heading: "2. 利用目的",
    body: "イベント運営（参加受付、抽選、チーム編成、抽選結果や日程変更等の事前連絡、当日の連絡）、参加者数の把握、今後の企画運営の参考とする目的で利用します。目的外の利用は行いません。",
  },
  {
    heading: "3. 第三者提供",
    body: "法令に基づく場合を除き、ご本人の同意なく個人情報を第三者へ提供することはありません。",
  },
  {
    heading: "4. 写真・映像の取扱い",
    body: "登録時にご選択いただいた撮影・広報利用に関する意思にもとづき、公式サイト・SNS等での掲載可否を判断します。",
  },
  {
    heading: "5. 保管・削除",
    body: "取得した個人情報は、運営に必要な期間保管したのち、適切に破棄します。マイページからいつでも登録内容の確認・キャンセル（削除）が可能です。",
  },
  {
    heading: "6. お問い合わせ窓口",
    body: "個人情報の取扱いに関するお問い合わせは、主催団体 GDGoC KIT までご連絡ください。",
  },
];

export default function PrivacyPage() {
  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="ポリシー"
        title="個人情報の取扱方針"
        maxWidthClassName="max-w-2xl"
      />
      <div className="mx-auto max-w-2xl px-6">
        <p className="mt-4 text-sm text-foreground-soft">
          CivicAI Summit 2027（主催: GDGoC KIT）は、参加者の個人情報を以下の方針に基づき取り扱います。
        </p>

        <div className="mt-8 space-y-6">
          {sections.map((section) => (
            <div key={section.heading}>
              <p className="font-display font-bold">{section.heading}</p>
              <p className="mt-1 text-sm text-foreground-soft">
                {section.body}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-xs text-foreground-soft">
          このページの内容は現時点では仮のものです。正式版は確定次第、本ページを更新してお知らせします。
        </p>
      </div>
    </div>
  );
}
