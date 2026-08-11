import { NextResponse } from "next/server";
import fallback from "@/content/github-fallback.json";

export const revalidate = 86400;

const GITHUB_USERNAME = "fmargar";

interface Activity {
  date: string;
  count: number;
  level: number;
}

interface ContributionsResponse {
  data: Activity[];
  updatedAt: string;
}

function levelFor(count: number): number {
  if (count === 0) return 0;
  if (count < 3) return 1;
  if (count < 6) return 2;
  if (count < 10) return 3;
  return 4;
}

interface GithubGraphqlResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          weeks?: { contributionDays?: { date: string; contributionCount: number }[] }[];
        };
      };
    };
  };
}

async function fetchFromGithub(): Promise<ContributionsResponse | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { login: GITHUB_USERNAME } }),
      next: { revalidate: 86400 },
    });

    if (!res.ok) return null;

    const json: GithubGraphqlResponse = await res.json();
    const weeks = json.data?.user?.contributionsCollection?.contributionCalendar?.weeks;
    if (!weeks) return null;

    const data: Activity[] = weeks.flatMap((week) =>
      (week.contributionDays ?? []).map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: levelFor(day.contributionCount),
      })),
    );

    if (data.length === 0) return null;

    return { data, updatedAt: new Date().toISOString() };
  } catch {
    return null;
  }
}

// Sin GITHUB_TOKEN, o si GitHub falla, se cae al snapshot commiteado en
// content/github-fallback.json: la sección se pinta igual, con la fecha del
// último dato disponible en vez de un hueco roto.
export async function GET() {
  const live = await fetchFromGithub();
  return NextResponse.json(live ?? fallback);
}
