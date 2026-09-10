import { getGermanyPoliticsNews } from "@/lib/news";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(
      new Date(iso),
    );
  } catch {
    return "";
  }
}

// Government/political news out of Germany (see lib/news.ts). Renders
// nothing if the feed is empty - a fresh deploy before the first successful
// fetch, or the feed being fully exhausted with no last-known-good cache -
// rather than showing an empty section or an error to visitors.
export default async function News() {
  const articles = await getGermanyPoliticsNews();
  if (articles.length === 0) return null;

  return (
    <section id="news" className="max-w-content mx-auto section-pad py-28">
      <h2 className="text-sm tracking-[0.2em] uppercase text-subtle mb-10">News</h2>
      <ol className="space-y-10">
        {articles.map((article) => (
          <li key={article.id} className="grid sm:grid-cols-4 gap-4 sm:gap-8">
            <div className="sm:col-span-1 text-sm text-subtle">{formatDate(article.published)}</div>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group sm:col-span-3 block -m-3 rounded-2xl p-3 transition hover:bg-mist active:scale-[0.99]"
            >
              <h3 className="text-xl font-semibold leading-snug mb-1.5">
                {article.title}
                <span className="ml-1 align-top text-base text-subtle opacity-0 transition-opacity group-hover:opacity-100">
                  ↗
                </span>
              </h3>
              {article.site && <p className="text-[13px] text-subtle mb-2">{article.site}</p>}
              {article.summary && (
                <p className="text-base leading-relaxed text-ink/90 line-clamp-3">{article.summary}</p>
              )}
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
