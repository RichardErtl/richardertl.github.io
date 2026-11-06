import type { APIRoute, GetStaticPaths } from 'astro';
import { site } from '../../data/site';
import { articleTypeLabels, getArticles } from '../../lib/articles';
import { socialImage } from '../../lib/social-image.mjs';

export const getStaticPaths = (async () => {
  const articles = await getArticles();
  return [
    { params: { slug: 'default' }, props: { title: site.headline, kicker: 'Engineering journal' } },
    ...articles.map((article) => ({
      params: { slug: article.id },
      props: { title: article.data.title, kicker: articleTypeLabels[article.data.type] },
    })),
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await socialImage({ title: props.title, kicker: props.kicker });
  return new Response(png, { headers: { 'content-type': 'image/png' } });
};
