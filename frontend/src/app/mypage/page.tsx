import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/page-header";
import CancelButton from "@/components/cancel-button";
import GoogleLoginButton from "@/components/google-login-button";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "マイページ",
  description:
    "CivicAI Summit 2027 の申込み状況・抽選結果・チーム情報を確認するマイページです。",
};

const attendeeTypeLabel: Record<string, string> = {
  student: "学生",
  workingStudent: "社会人学生",
  professional: "社会人",
  other: "その他",
};

const areaLabel: Record<string, string> = {
  ishikawa: "石川県",
  toyama: "富山県",
  fukui: "福井県",
  other: "その他",
};

const lotteryLabel: Record<string, string> = {
  pending: "抽選待ち",
  won: "当選",
  lost: "落選",
};

const quotaLabel: Record<string, string> = {
  studentPriority: "学生優先枠（105名・先着順）",
  studentGeneral: "学生・社会人枠（45名・抽選）",
};

const trackLabel: Record<string, string> = {
  bousai: "防災・安全",
  civic: "シビック・アクセシビリティ",
  culture: "ローカルカルチャー＆コミュニティエコノミー",
  green: "グリーン＆スマートシティ",
};

function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: "green" | "blue" | "gray";
}) {
  const toneClass =
    tone === "green"
      ? "bg-g-green/10 text-g-green"
      : tone === "blue"
        ? "bg-g-blue/10 text-g-blue"
        : "bg-rule text-foreground-soft";
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${toneClass}`}>
      {label}
    </span>
  );
}

function lotteryTone(result: string): "green" | "blue" | "gray" {
  if (result === "won") return "green";
  if (result === "lost") return "gray";
  return "blue";
}

export default async function MyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="pb-20">
        <PageHeader eyebrow="マイページ" title="マイページ" maxWidthClassName="max-w-2xl" />
        <div className="mx-auto max-w-2xl px-6">
          <div className="mt-8">
            <GoogleLoginButton next="/mypage" />
          </div>
        </div>
      </div>
    );
  }

  const [
    { data: registration },
    { data: session },
    { data: hackathon },
    { data: appSettings },
  ] = await Promise.all([
    supabase
      .from("registrations")
      .select(
        "name, nickname, nickname_reading, affiliation, affiliation_area, attendee_type",
      )
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("session_applications")
      .select("lottery_result")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("hackathon_applications")
      .select(
        "quota, track_primary, assigned_track, lottery_result, team_number",
      )
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("app_settings")
      .select("results_confirmed")
      .eq("id", 1)
      .maybeSingle(),
  ]);

  // 抽選・チーム編成が管理者によって公開されるまでは、結果を一切見せない
  const resultsConfirmed = appSettings?.results_confirmed ?? false;

  let teamRoster: string[] = [];
  if (resultsConfirmed && hackathon?.team_number) {
    const { data: roster } = await supabase.rpc("get_my_team_roster");
    teamRoster = (roster ?? []).map((r: { nickname: string }) => r.nickname);
  }

  return (
    <div className="pb-20">
      <PageHeader eyebrow="マイページ" title="マイページ" maxWidthClassName="max-w-2xl" />
      <div className="mx-auto max-w-2xl px-6">
        <p className="mt-4 text-sm text-foreground-soft">
          メインイベント・第一部・第二部の申込み状況や、第二部の抽選結果・トラック割当・チーム情報を確認できます。
        </p>

        <div className="mt-10 space-y-6">
          {!registration ? (
            <div className="rounded-2xl border border-rule bg-card p-6 text-center">
              <p className="text-sm text-foreground-soft">
                メインイベントにまだ登録していません。
              </p>
              <Link
                href="/register"
                className="mt-3 inline-block rounded-full bg-g-blue px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-[#1a56c4]"
              >
                メインイベント登録へ
              </Link>
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-rule bg-card p-6">
                <p className="font-display font-bold">登録者情報</p>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-foreground-soft">氏名</dt>
                    <dd className="font-bold">{registration.name}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-foreground-soft">
                      メールアドレス
                    </dt>
                    <dd className="font-bold">{user.email}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-foreground-soft">
                      ユーザー名・ニックネーム
                    </dt>
                    <dd className="font-bold">
                      {registration.nickname}
                      {registration.nickname_reading ? (
                        <span className="ml-1 font-normal text-foreground-soft">
                          （{registration.nickname_reading}）
                        </span>
                      ) : null}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-foreground-soft">所属先</dt>
                    <dd className="font-bold">{registration.affiliation}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-foreground-soft">
                      所属先の所在地
                    </dt>
                    <dd className="font-bold">
                      {areaLabel[registration.affiliation_area] ??
                        registration.affiliation_area}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-foreground-soft">
                      参加者区分
                    </dt>
                    <dd className="font-bold">
                      {attendeeTypeLabel[registration.attendee_type] ??
                        registration.attendee_type}
                    </dd>
                  </div>
                </dl>
                <CancelButton
                  table="registrations"
                  userId={user.id}
                  label="メインイベント登録をキャンセルする"
                  confirmMessage="メインイベント登録をキャンセルします。第一部・第二部への申込みも同時にキャンセルされます。よろしいですか？"
                  toastMessage="メインイベント登録をキャンセルしました"
                  cascadeTables={["session_applications", "hackathon_applications"]}
                />
              </div>

              <div className="rounded-2xl border border-rule bg-card p-6">
                <div className="flex items-center justify-between">
                  <p className="font-display font-bold">第一部（セッション）</p>
                  {session ? (
                    resultsConfirmed ? (
                      <StatusBadge
                        label={lotteryLabel[session.lottery_result] ?? "抽選待ち"}
                        tone={lotteryTone(session.lottery_result)}
                      />
                    ) : (
                      <StatusBadge label="抽選待ち" tone="blue" />
                    )
                  ) : (
                    <StatusBadge label="未申込み" tone="gray" />
                  )}
                </div>
                {!session ? (
                  <Link
                    href="/register/session"
                    className="mt-3 inline-block text-sm font-bold text-g-blue hover:underline"
                  >
                    第一部に申し込む →
                  </Link>
                ) : (
                  <CancelButton
                    table="session_applications"
                    userId={user.id}
                    label="第一部の申込みをキャンセルする"
                    confirmMessage="第一部（セッション）への申込みをキャンセルします。よろしいですか？"
                    toastMessage="第一部の申込みをキャンセルしました"
                  />
                )}
              </div>

              <div className="rounded-2xl border border-rule bg-card p-6">
                <div className="flex items-center justify-between">
                  <p className="font-display font-bold">第二部（ハッカソン）</p>
                  {hackathon ? (
                    resultsConfirmed ? (
                      <StatusBadge
                        label={
                          lotteryLabel[hackathon.lottery_result] ?? "抽選待ち"
                        }
                        tone={lotteryTone(hackathon.lottery_result)}
                      />
                    ) : (
                      <StatusBadge label="抽選待ち" tone="blue" />
                    )
                  ) : (
                    <StatusBadge label="未申込み" tone="gray" />
                  )}
                </div>
                {!hackathon ? (
                  <Link
                    href="/register/hackathon"
                    className="mt-3 inline-block text-sm font-bold text-g-blue hover:underline"
                  >
                    第二部に申し込む →
                  </Link>
                ) : (
                  <>
                    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="text-xs text-foreground-soft">
                          申込み枠
                        </dt>
                        <dd className="font-bold">
                          {quotaLabel[hackathon.quota] ?? hackathon.quota}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-foreground-soft">
                          第1希望トラック
                        </dt>
                        <dd className="font-bold">
                          {trackLabel[hackathon.track_primary] ??
                            hackathon.track_primary}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-foreground-soft">
                          割当トラック
                        </dt>
                        <dd className="font-bold">
                          {resultsConfirmed && hackathon.assigned_track
                            ? (trackLabel[hackathon.assigned_track] ??
                              hackathon.assigned_track)
                            : "未確定"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-foreground-soft">
                          チーム番号
                        </dt>
                        <dd className="font-bold">
                          {resultsConfirmed
                            ? (hackathon.team_number ?? "未確定")
                            : "未確定"}
                        </dd>
                      </div>
                    </dl>
                    {teamRoster.length > 0 ? (
                      <div className="mt-4">
                        <p className="text-xs text-foreground-soft">
                          チームメンバー
                        </p>
                        <ul className="mt-2 flex flex-wrap gap-2">
                          {teamRoster.map((member) => (
                            <li
                              key={member}
                              className="rounded-full border border-rule bg-white px-3 py-1 text-xs font-bold"
                            >
                              {member}
                              {member === registration.nickname
                                ? "（あなた）"
                                : ""}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    <CancelButton
                      table="hackathon_applications"
                      userId={user.id}
                      label="第二部の応募をキャンセルする"
                      confirmMessage="第二部（ハッカソン）への応募をキャンセルします。よろしいですか？"
                      toastMessage="第二部の応募をキャンセルしました"
                    />
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
