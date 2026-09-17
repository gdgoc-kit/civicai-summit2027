import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import { faqs } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "よくある質問",
  description: "CivicAI Summit 2027 についてよくある質問にお答えします。",
};

export default function FaqPage() {
  return (
    <div className="pb-20">
      <PageHeader eyebrow="ヘルプ" title="よくある質問" />
      <div className="mx-auto max-w-5xl px-6">
        <div className="mt-10 space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q}>
              <p className="font-bold">Q. {faq.q}</p>
              <p className="mt-1 text-sm text-foreground-soft">A. {faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
