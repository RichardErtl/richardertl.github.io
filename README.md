# Richard Ertl: engineering journal

Personal engineering journal and portfolio. Static site built with Astro, TypeScript strict and pnpm.

## Run it

```sh
pnpm install     # once
pnpm dev         # review at http://localhost:4321, drafts visible with a "Draft" mark
pnpm check       # type and template check
pnpm build       # production build into dist/, drafts excluded
pnpm preview     # serve dist/ locally
```

Astro's anonymous CLI telemetry is disabled on this machine. On any other machine, run
`pnpm astro telemetry disable` once.

## Site address and indexing

`SITE_URL` sets the site address at build time. The intended value is
`https://richardertl.github.io`. It is deliberately not the default.

| Build | Result |
| --- | --- |
| `SITE_URL` unset | `http://localhost:4321` as address, `noindex` on every page, disallow-all `robots.txt`, no sitemap |
| `SITE_URL` set | public address, indexable pages, public `robots.txt`, sitemap |

Legal pages always carry `noindex` and stay out of the sitemap.

## Write an article

Add a Markdown file to `src/content/articles/`. The filename is the slug. The body has no H1, because
the page renders the title.

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | |
| `description` | yes | |
| `type` | yes | `engineering-note`, `case-study` or `research-article` |
| `tags` | no | list of strings |
| `draft` | no | defaults to `true` |
| `publishedAt` | when `draft: false` | unquoted date, for example `2026-11-06`; the build fails without it |
| `order` | no | position among articles of the same day, lowest first |
| `updatedAt` | no | unquoted date |
| `coverImage` | no | |

A blockquote that starts with a bold `TL;DR` becomes the callout. An image paragraph followed by an
italic paragraph becomes a figure with a caption. A published article gets its social image at
`/social/<slug>.png`, a listing, an RSS item and a sitemap entry automatically.

## Add a project

Add one Markdown file to `src/content/projects/`. The filename is the slug. `/projects/`, the project
page and the homepage section read from the collection. The schema in `src/content.config.ts` lists
every field. `relatedArticles` holds article slugs; only published ones render in production.

## Where things live

- `src/data/site.ts`: figures, links and contact details shown on the site.
- `src/data/sessions-weekly.json`: weekly totals behind the chart.
- `src/lib/articles.ts`: the shared draft filter. Every listing, route and feed goes through it.
- `src/lib/social-image.mjs`: renders the social images during the build.
- `src/styles/global.css`: the design system. The order of its sections matters.
- `docs/deployment-checklist.md`: what must happen before publication.
- `.github/workflows/deploy.yml`: Pages deployment, started by hand only.

