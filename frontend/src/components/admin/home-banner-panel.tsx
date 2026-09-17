"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function HomeBannerPanel({
  initialText,
  initialHref,
}: {
  initialText: string | null;
  initialHref: string | null;
}) {
  const router = useRouter();
  const [text, setText] = useState(initialText ?? "");
  const [href, setHref] = useState(initialHref ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("app_settings")
      .update({
        home_banner_text: text.trim() || null,
        home_banner_href: href.trim() || null,
      })
      .eq("id", 1);
    setSaving(false);
    if (updateError) {
      setError("保存に失敗しました。時間をおいて再度お試しください。");
      return;
    }
    setSaved(true);
    router.refresh();
  };

  return (
    <div className="rounded-2xl border border-rule bg-card p-6">
      <p className="font-display font-bold">トップページのお知らせバナー</p>
      <p className="mt-2 text-sm text-foreground-soft">
        トップページ（/）上部に表示するお知らせです。テキストを空にすると非表示になります。リンク先は省略可能です（省略時はリンクなしのテキスト表示）。
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <label className="text-xs font-bold text-foreground-soft">
            表示テキスト
          </label>
          <input
            type="text"
            value={text}
            placeholder="例：メインイベント登録の申込みを開始しました！"
            onChange={(e) => {
              setText(e.target.value);
              setSaved(false);
            }}
            className="mt-1 w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm outline-none focus:border-g-blue"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-foreground-soft">
            リンク先（任意）
          </label>
          <input
            type="text"
            value={href}
            placeholder="/register"
            onChange={(e) => {
              setHref(e.target.value);
              setSaved(false);
            }}
            className="mt-1 w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm outline-none focus:border-g-blue"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="rounded-full bg-g-blue px-5 py-2.5 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#1a56c4] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "保存中..." : "保存する"}
        </button>
        {saved ? (
          <span className="text-sm font-bold text-g-green">保存しました</span>
        ) : null}
        {error ? <span className="text-sm text-g-red">{error}</span> : null}
      </div>
    </div>
  );
}
