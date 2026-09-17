import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import { programSchedule } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "プログラム構成",
  description:
    "CivicAI Summit 2027 は、1日目のセッションと2日目のハッカソンからなる2日間のプログラムです。",
};

export default function ProgramPage() {
  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="プログラム"
        title="2日間のプログラム構成（予定）"
      />
      <div className="mx-auto max-w-5xl px-6">
        <div className="mt-10 space-y-10">
          {programSchedule.map((day) => (
            <div
              key={day.day}
              className="rounded-2xl border border-rule bg-card p-6 sm:p-8"
            >
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-g-blue">
                {day.day}
              </p>
              <h2 className="mt-2 font-display text-xl font-bold">
                {day.title}
              </h2>
              {"note" in day && day.note ? (
                <p className="mt-1 text-xs text-foreground-soft">
                  {day.note}
                </p>
              ) : null}

              {/* モバイル：時間＋内容の1カラムリスト */}
              <div className="mt-6 divide-y divide-rule sm:hidden">
                {day.rows.map((row) => (
                  <div
                    key={row.time}
                    className="flex flex-col gap-1 py-3"
                  >
                    <p className="shrink-0 font-mono text-xs text-g-blue">
                      {row.time}
                    </p>
                    <p className="text-sm font-bold">{row.content}</p>
                  </div>
                ))}
              </div>

              {/* PC：会場別のタイムテーブル（会場列は幅を揃え、文字は折り返す） */}
              <div className="mt-6 hidden overflow-x-auto sm:block">
                <table className="w-full table-fixed text-left text-sm">
                  <colgroup>
                    <col style={{ width: "7rem" }} />
                    {day.venues.map((venue) => (
                      <col
                        key={venue}
                        style={{ width: `${100 / day.venues.length}%` }}
                      />
                    ))}
                  </colgroup>
                  <thead>
                    <tr className="border-b border-rule text-xs text-foreground-soft">
                      <th className="py-2 pr-4 font-normal">時間</th>
                      {day.venues.map((venue) => (
                        <th key={venue} className="py-2 pr-4 font-normal">
                          {venue}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {day.rows.map((row) => {
                      const byVenue =
                        "byVenue" in row ? row.byVenue : undefined;
                      return (
                        <tr
                          key={row.time}
                          className="border-b border-rule last:border-0"
                        >
                          <td className="whitespace-nowrap py-3 pr-4 font-mono text-xs text-g-blue">
                            {row.time}
                          </td>
                          {byVenue
                            ? day.venues.map((venue) => (
                                <td
                                  key={venue}
                                  className="break-words py-3 pr-4 font-bold"
                                >
                                  {byVenue[venue] ?? ""}
                                </td>
                              ))
                            : (
                                <td
                                  className="break-words py-3 pr-4 font-bold"
                                  colSpan={day.venues.length}
                                >
                                  {row.content}
                                </td>
                              )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-foreground-soft">
          ※
          上記は現時点の予定です。内容・時間配分は確定次第、随時更新します。
        </p>
      </div>
    </div>
  );
}
