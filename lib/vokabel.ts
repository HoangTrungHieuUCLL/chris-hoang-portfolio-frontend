// Fetches aggregate KPIs from Vokabel's public, unauthenticated stats
// endpoint (GET /public/stats on the vokabel-backend Railway service).
// No word text ever comes back from that endpoint -- just counts.

export type VokabelStats = {
  total_words: number;
  hard_to_remember: number;
  by_type: Record<string, number>;
  added_last_30_days: { date: string; count: number }[];
};

const VOKABEL_API_URL = process.env.NEXT_PUBLIC_VOKABEL_API_URL ?? "http://localhost:8001";

export async function getVokabelStats(): Promise<VokabelStats | null> {
  try {
    const res = await fetch(`${VOKABEL_API_URL}/public/stats`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return (await res.json()) as VokabelStats;
  } catch {
    return null;
  }
}
