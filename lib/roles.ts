/**
 * The three lanes the site is organised around. They double as the project
 * taxonomy: the same three labels colour the project cards, drive the hero's
 * lane control, and set the order projects appear in.
 *
 * These are deliberately NOT the API's `Project.category` string, which stays
 * free-form display text. Tags live here, keyed by slug, so adding a lane to a
 * project is a one-line edit with no backend change.
 */

export const ROLES = ["data-analyst", "data-engineer", "ai-engineer"] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_LABEL: Record<Role, string> = {
  "data-analyst": "Data Analyst",
  "data-engineer": "Data Engineer",
  "ai-engineer": "AI Engineer",
};

/** Lane shown first to a visitor who hasn't chosen one. */
export const DEFAULT_ROLE: Role = "data-analyst";

/**
 * Tailwind classes per lane, split by the ground they sit on: the `-dark`
 * half of each pair is for the near-black project cards, the plain half for
 * paper. Full literal strings, never built by interpolation, so Tailwind's
 * scanner actually finds them.
 */
export const ROLE_TEXT_ON_DARK: Record<Role, string> = {
  "data-analyst": "text-role-analyst-dark",
  "data-engineer": "text-role-engineer-dark",
  "ai-engineer": "text-role-ai-dark",
};

export const ROLE_DOT_ON_DARK: Record<Role, string> = {
  "data-analyst": "bg-role-analyst-dark",
  "data-engineer": "bg-role-engineer-dark",
  "ai-engineer": "bg-role-ai-dark",
};

export const ROLE_DOT_ON_PAPER: Record<Role, string> = {
  "data-analyst": "bg-role-analyst",
  "data-engineer": "bg-role-engineer",
  "ai-engineer": "bg-role-ai",
};

/**
 * Which lanes each project speaks to. A project can carry several or none -
 * untagged is a valid state, not a gap, and anything the API returns that
 * isn't listed here simply renders neutral.
 */
const PROJECT_ROLES: Record<string, Role[]> = {
  "automated-sales-forecast-pipeline": ["data-engineer", "data-analyst"],
  "store-kpi-dashboard": ["data-analyst"],
  "sales-impact-pricing-analysis": ["data-analyst"],
  "ai-talent-matching-system": ["ai-engineer", "data-engineer"],
  "faulty-gas-bottle-detection": ["ai-engineer"],
  "football-tactic-prediction": ["ai-engineer"],
};

export function rolesForProject(slug: string): Role[] {
  return PROJECT_ROLES[slug] ?? [];
}

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}
