import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { site } from '../data/site';
import { articleHref, getArticles } from '../lib/articles';

export const GET: APIRoute = async (context) => {
  const articles = await getArticles();
  return rss({
    title: `${site.name}: engineering journal`,
    description: site.description,
    site: context.site!,
    customData: '<language>en</language>',
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      link: articleHref(article),
      pubDate: article.data.publishedAt,
    })),
  });
};
