import type { APIRoute } from 'astro';
import { isPublicBuild } from '../data/site';

export const GET: APIRoute = ({ site }) => {
  const body = isPublicBuild
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site)}\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
