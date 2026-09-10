// Server-only: never import this from a Client Component. The webz.io token
// stays in WEBZIO_API_TOKEN (see .env.example) - it must never be embedded in
// client-shipped code or committed to git.

export type NewsItem = {
  id: string;
  title: string;
  url: string;
  summary: string;
  site: string;
  published: string;
  imageUrl: string | null;
};

type RawPost = {
  uuid?: string;
  url?: string;
  title?: string;
  summary?: string;
  text?: string;
  published?: string;
  thread?: {
    site?: string;
    site_full?: string;
    main_image?: string;
  };
};

// The exact query given for this section: German government political news,
// in English. `ts` anchors the result window for `sort=crawled` - verified
// against the live API that dropping it returns zero results, so it's kept
// as-is rather than guessed at. Over a long enough time this anchor may need
// refreshing to keep surfacing newer articles; token goes on the front here.
const NEWS_QUERY =
  "q=trust.source.type%3A%22gov_news%22+AND+country%3A%22DE%22+AND+category%3A%22politics%22+AND+language%3A%22english%22" +
  "&sort=crawled&ts=1781278150802&format=json&size=10&webz_reporter=true&includeSyndicated=false&allowNewsHistory=true";

// The webz.io token backing this has a small balance and this query costs
// real credits per call. In-memory only (resets on redeploy, not across
// requests within one running server process) - enough to ride out a quota
// hiccup or transient error mid-lifetime of the deployed process, without
// standing up a database/volume just for a news teaser.
let lastGood: NewsItem[] | null = null;

function toNewsItem(post: RawPost): NewsItem | null {
  if (!post.uuid || !post.title || !post.url || !post.published) return null;
  return {
    id: post.uuid,
    title: post.title,
    url: post.url,
    summary: post.summary?.trim() || post.text?.slice(0, 220).trim() || "",
    site: post.thread?.site_full || post.thread?.site || "",
    published: post.published,
    imageUrl: post.thread?.main_image?.trim() || null,
  };
}

export async function getGermanyPoliticsNews(): Promise<NewsItem[]> {
  const token = process.env.WEBZIO_API_TOKEN;
  if (!token) return lastGood ?? [];

  try {
    const response = await fetch(`https://api.webz.io/api/news?token=${token}&${NEWS_QUERY}`, {
      headers: { Accept: "application/json" },
      // Next.js only re-fetches when a request comes in after this window
      // has elapsed (stale-while-revalidate), not on a fixed background
      // timer - so actual call frequency scales with real visitor traffic.
      next: { revalidate: 600 },
    });
    if (!response.ok) return lastGood ?? [];

    const data = (await response.json()) as { posts?: RawPost[] };
    const items = (data.posts ?? [])
      .map(toNewsItem)
      .filter((item): item is NewsItem => item !== null);

    if (items.length > 0) lastGood = items;
    return lastGood ?? [];
  } catch {
    return lastGood ?? [];
  }
}
