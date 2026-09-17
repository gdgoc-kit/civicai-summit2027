import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import { newsPosts } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "お知らせ",
  description: "CivicAI Summit 2027 からのお知らせ・更新履歴です。",
};

export default function NewsPage() {
  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="お知らせ"
        title="お知らせ・更新履歴"
        description="CivicAI Summit 2027 に関するお知らせを、更新の新しい順に掲載します。"
      />
      <div className="mx-auto max-w-5xl px-6">
        {newsPosts.length === 0 ? (
          <p className="mt-10 rounded-2xl border border-rule bg-card p-8 text-center text-sm text-foreground-soft">
            現在お知らせはありません。
          </p>
        ) : (
          <div className="mt-10 divide-y divide-rule rounded-2xl border border-rule bg-card">
            {newsPosts.map((post) => (
              <article key={`${post.date}-${post.title}`} className="p-6">
                <p className="font-mono text-xs text-g-blue">{post.date}</p>
                <h2 className="mt-1 font-display font-bold">{post.title}</h2>
                <p className="mt-2 text-sm text-foreground-soft">
                  {post.body}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
