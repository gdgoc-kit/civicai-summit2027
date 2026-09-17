// 抽選・チーム編成の自動割当ロジック。
// 管理者が「自動実行」を押したときに、ブラウザ側でこの計算を行い、
// 結果を Supabase に書き込む（下書き状態。app_settings.results_confirmed が
// true になるまで参加者には公開されない）。

const experienceRank: Record<string, number> = {
  none: 0,
  underOne: 1,
  oneToThree: 2,
  overThree: 3,
};

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export type SessionApplicant = { userId: string };

export function runSessionLottery(
  applicants: SessionApplicant[],
  capacity: number,
): Map<string, "won" | "lost"> {
  const result = new Map<string, "won" | "lost">();
  const winners = new Set(
    shuffle(applicants)
      .slice(0, Math.max(0, capacity))
      .map((a) => a.userId),
  );
  for (const a of applicants) {
    result.set(a.userId, winners.has(a.userId) ? "won" : "lost");
  }
  return result;
}

export type HackathonApplicant = {
  userId: string;
  nickname: string;
  quota: "studentPriority" | "studentGeneral";
  trackPrimary: string;
  trackSecondary: string;
  experienceLevel: string;
  teammateRequest: string | null;
  appliedAt: string;
  attendedDay1: boolean;
};

export function runHackathonLottery(
  applicants: HackathonApplicant[],
  studentPriorityCapacity: number,
  studentGeneralCapacity: number,
): Map<string, "won" | "lost"> {
  const result = new Map<string, "won" | "lost">();

  const priority = applicants.filter((a) => a.quota === "studentPriority");
  const general = applicants.filter((a) => a.quota === "studentGeneral");

  // 学生優先枠：先着順（申込み日時が早い順）
  const priorityWinners = new Set(
    [...priority]
      .sort(
        (a, b) =>
          new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime(),
      )
      .slice(0, Math.max(0, studentPriorityCapacity))
      .map((a) => a.userId),
  );
  for (const a of priority) {
    result.set(a.userId, priorityWinners.has(a.userId) ? "won" : "lost");
  }

  // 学生・社会人枠：抽選
  const generalWinners = new Set(
    shuffle(general)
      .slice(0, Math.max(0, studentGeneralCapacity))
      .map((a) => a.userId),
  );
  for (const a of general) {
    result.set(a.userId, generalWinners.has(a.userId) ? "won" : "lost");
  }

  return result;
}

export type TeamAssignment = { assignedTrack: string; teamNumber: string };

const trackShortLabel: Record<string, string> = {
  bousai: "防災安全",
  civic: "シビック",
  culture: "カルチャー",
  green: "グリーン",
};

export function assignTeams(
  winners: HackathonApplicant[],
  targetTeamSize = 5,
): Map<string, TeamAssignment> {
  const result = new Map<string, TeamAssignment>();
  if (winners.length === 0) return result;

  // 1. まずは第1希望トラックでグルーピング
  const byTrack = new Map<string, HackathonApplicant[]>();
  for (const w of winners) {
    const list = byTrack.get(w.trackPrimary) ?? [];
    list.push(w);
    byTrack.set(w.trackPrimary, list);
  }

  // 2. 偏りが大きいトラックは、超過分を第2希望トラックへ移す
  const average = winners.length / Math.max(1, byTrack.size);
  const overflowThreshold = average * 1.4;
  for (const [track, members] of byTrack) {
    if (members.length <= overflowThreshold) continue;
    const shuffled = shuffle(members);
    const keep = shuffled.slice(0, Math.ceil(overflowThreshold));
    const overflow = shuffled.slice(Math.ceil(overflowThreshold));
    byTrack.set(track, keep);
    for (const person of overflow) {
      const target = byTrack.get(person.trackSecondary) ?? [];
      target.push(person);
      byTrack.set(person.trackSecondary, target);
    }
  }

  // 3. トラックごとにチーム分け（相互指名ペアは優先的に同じチームへ、経験レベルを分散）
  for (const [track, members] of byTrack) {
    const nicknameMap = new Map(
      members.map((m) => [m.nickname.trim().toLowerCase(), m]),
    );
    const paired = new Set<string>();
    type Unit = {
      people: HackathonApplicant[];
      expRank: number;
      attendedDay1: boolean;
    };
    const units: Unit[] = [];

    for (const person of members) {
      if (paired.has(person.userId)) continue;
      const requested = person.teammateRequest?.trim().toLowerCase();
      const partner = requested ? nicknameMap.get(requested) : undefined;
      const isMutual =
        partner &&
        !paired.has(partner.userId) &&
        partner.teammateRequest?.trim().toLowerCase() ===
          person.nickname.trim().toLowerCase();

      if (partner && isMutual) {
        paired.add(person.userId);
        paired.add(partner.userId);
        units.push({
          people: [person, partner],
          expRank:
            (experienceRank[person.experienceLevel] +
              experienceRank[partner.experienceLevel]) /
            2,
          attendedDay1: person.attendedDay1 || partner.attendedDay1,
        });
      } else {
        paired.add(person.userId);
        units.push({
          people: [person],
          expRank: experienceRank[person.experienceLevel] ?? 0,
          attendedDay1: person.attendedDay1,
        });
      }
    }

    // 経験レベル順に並べてラウンドロビンでチームへ配分（経験の偏りを抑える）。
    // 第一部（Day1）参加者は、特定チームに偏らないよう独立した巡回でチームに割り当てる。
    const teamCount = Math.max(1, Math.round(members.length / targetTeamSize));
    const teamLabel = trackShortLabel[track] ?? track;

    const day1Units = units
      .filter((u) => u.attendedDay1)
      .sort((a, b) => b.expRank - a.expRank);
    const otherUnits = units
      .filter((u) => !u.attendedDay1)
      .sort((a, b) => b.expRank - a.expRank);

    for (const group of [day1Units, otherUnits]) {
      group.forEach((unit, index) => {
        const teamIndex = (index % teamCount) + 1;
        const teamNumber = `${teamLabel}-${teamIndex}`;
        for (const person of unit.people) {
          result.set(person.userId, { assignedTrack: track, teamNumber });
        }
      });
    }
  }

  return result;
}
