import { cacheLife } from "next/cache";

export interface ContributionDay {
  /** Date ISO « yyyy-MM-dd ». */
  date: string;
  count: number;
  /** Intensité de 0 (aucune) à 4 (beaucoup), comme sur GitHub. */
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionCalendar {
  /** Total des contributions sur les 12 derniers mois. */
  total: number;
  days: ContributionDay[];
}

const GRAPHQL_LEVELS: Record<string, ContributionDay["level"]> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

/**
 * Calendrier de contributions GitHub des 12 derniers mois.
 * - Avec GITHUB_TOKEN (variable d'env côté serveur, aucun scope requis) : API GraphQL officielle.
 * - Sans token : API publique github-contributions-api.jogruber.de (lit le profil public).
 * Mis en cache quelques heures ; renvoie null si GitHub est injoignable (le widget se masque).
 */
export async function getContributionCalendar(username: string): Promise<ContributionCalendar | null> {
  "use cache";
  cacheLife("hours");

  try {
    const token = process.env.GITHUB_TOKEN;
    return token ? await fetchFromGraphql(username, token) : await fetchFromPublicApi(username);
  } catch (error) {
    console.error("[github] contributions indisponibles :", error);
    return null;
  }
}

async function fetchFromGraphql(username: string, token: string): Promise<ContributionCalendar> {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `query($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks { contributionDays { date contributionCount contributionLevel } }
            }
          }
        }
      }`,
      variables: { login: username },
    }),
  });
  if (!res.ok) throw new Error(`GraphQL HTTP ${res.status}`);

  const json = await res.json();
  const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) throw new Error(`Réponse GraphQL inattendue : ${JSON.stringify(json?.errors ?? json)}`);

  const days: ContributionDay[] = calendar.weeks.flatMap(
    (week: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }) =>
      week.contributionDays.map((d) => ({
        date: d.date,
        count: d.contributionCount,
        level: GRAPHQL_LEVELS[d.contributionLevel] ?? 0,
      })),
  );
  return { total: calendar.totalContributions, days };
}

async function fetchFromPublicApi(username: string): Promise<ContributionCalendar> {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`,
  );
  if (!res.ok) throw new Error(`API publique HTTP ${res.status}`);

  const json: { total: { lastYear: number }; contributions: ContributionDay[] } = await res.json();
  return { total: json.total.lastYear, days: json.contributions };
}
