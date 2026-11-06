import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'articles'>;

export const articleTypeLabels: Record<Article['data']['type'], string> = {
  'engineering-note': 'Engineering note',
  'case-study': 'Case study',
  'research-article': 'Research article',
};

export const articleHref = (article: Article) => `/articles/${article.id}/`;

export const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/**
 * The one gate for draft visibility: every listing, route and feed goes through it.
 * `astro dev` sees drafts so they can be reviewed; production builds never do.
 * Newest first; undated drafts lead, since they are the newest work.
 * Articles from the same day follow their `order` field, then their title.
 */
export async function getArticles(): Promise<Article[]> {
  const articles = await getCollection('articles', ({ data }) => import.meta.env.MODE === 'development' || !data.draft);
  const time = (article: Article) => article.data.publishedAt?.getTime() ?? Infinity;
  const rank = (article: Article) => article.data.order ?? Infinity;
  return articles.sort((a, b) => {
    const [newer, older] = [time(b), time(a)];
    if (newer !== older) return newer > older ? 1 : -1;
    if (rank(a) !== rank(b)) return rank(a) < rank(b) ? -1 : 1;
    return a.data.title.localeCompare(b.data.title);
  });
}
