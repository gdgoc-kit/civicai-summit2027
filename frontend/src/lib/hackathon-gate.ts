import { createClient } from "@/lib/supabase/server";

const hokurikuAreas = new Set(["ishikawa", "toyama", "fukui"]);

export type HackathonApplicationRecord = {
  quota: string;
  lottery_result: string;
  team_number: string | null;
};

export type HackathonApplicationContext =
  | { kind: "not-registered" }
  | { kind: "not-hokuriku" }
  | {
      kind: "already-applied";
      application: HackathonApplicationRecord;
      isStudent: boolean;
    }
  | { kind: "eligible"; isStudent: boolean };

export async function getHackathonApplicationContext(
  userId: string,
): Promise<HackathonApplicationContext> {
  const supabase = await createClient();

  const { data: registration } = await supabase
    .from("registrations")
    .select("attendee_type, affiliation_area")
    .eq("user_id", userId)
    .maybeSingle();

  if (!registration) {
    return { kind: "not-registered" };
  }

  if (!hokurikuAreas.has(registration.affiliation_area)) {
    return { kind: "not-hokuriku" };
  }

  const isStudent = registration.attendee_type === "student";

  const { data: application } = await supabase
    .from("hackathon_applications")
    .select("quota, lottery_result, team_number")
    .eq("user_id", userId)
    .maybeSingle();

  if (application) {
    return { kind: "already-applied", application, isStudent };
  }

  return { kind: "eligible", isStudent };
}
