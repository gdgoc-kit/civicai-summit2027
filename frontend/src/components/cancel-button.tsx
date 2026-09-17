"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { queueToast } from "@/lib/toast";

type Table = "registrations" | "session_applications" | "hackathon_applications";

export default function CancelButton({
  table,
  userId,
  confirmMessage,
  label = "キャンセルする",
  toastMessage = "キャンセルしました",
  cascadeTables = [],
}: {
  table: Table;
  userId: string;
  confirmMessage: string;
  label?: string;
  toastMessage?: string;
  cascadeTables?: Table[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (!window.confirm(confirmMessage)) return;
    setLoading(true);
    setError(null);

    const supabase = createClient();

    for (const cascadeTable of cascadeTables) {
      await supabase.from(cascadeTable).delete().eq("user_id", userId);
    }

    const { error: deleteError } = await supabase
      .from(table)
      .delete()
      .eq("user_id", userId);

    setLoading(false);
    if (deleteError) {
      setError("キャンセルに失敗しました。時間をおいて再度お試しください。");
      return;
    }

    queueToast(toastMessage);
    router.refresh();
  };

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="text-xs font-bold text-g-red transition-colors duration-150 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "処理中..." : label}
      </button>
      {error ? <p className="mt-1 text-xs text-g-red">{error}</p> : null}
    </div>
  );
}
