export type Project = {
  id: number;
  slug: string;
  name: string;
  description: string;
  tech_stack: string[];
  category: string;
  organization: string | null;
  year: string;
  link_url: string | null;
  link_label: string | null;
  repo_url: string | null;
  image_url: string | null;
  image_credit_name: string | null;
  image_credit_url: string | null;
  featured: boolean;
};

import { FALLBACK_PROJECTS } from "@/lib/data/fallbackProjects";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * Never resolves to an empty list: the Projects section is the strongest proof
 * of work on the page, and a backend hiccup used to blank it behind a "check
 * back shortly" placeholder. Any path that would render nothing - transport
 * error, non-2xx, or a successful but empty response - serves the bundled
 * fallback instead. Only a real, non-empty response is cached.
 */
export async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${API_URL}/api/projects`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return FALLBACK_PROJECTS;

    const projects = (await res.json()) as Project[];
    return projects.length > 0 ? projects : FALLBACK_PROJECTS;
  } catch {
    return FALLBACK_PROJECTS;
  }
}

export async function submitContactMessage(payload: {
  name: string;
  email: string;
  message: string;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return { ok: false, error: data?.detail ?? "Something went wrong. Please try again." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not reach the server. Please try again later." };
  }
}
