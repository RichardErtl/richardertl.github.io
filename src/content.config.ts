import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articleTypes = ['engineering-note', 'case-study', 'research-article'] as const;

const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/*.md' }),
  schema: z
    .object({
      title: z.string().min(1),
      description: z.string().min(1),
      type: z.enum(articleTypes),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(true),
      publishedAt: z.date().optional(),
      updatedAt: z.date().optional(),
      order: z.number().int().optional(),
      coverImage: z.string().optional(),
    })
    .refine((article) => article.draft || article.publishedAt !== undefined, {
      message: 'A published article (draft: false) needs a publishedAt date.',
      path: ['publishedAt'],
    }),
});

const screenshot = z.object({
  src: z.string().startsWith('/'),
  alt: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
    name: z.string().min(1),
    tagline: z.string().min(1),
    summary: z.string().min(1),
    status: z.enum(['private', 'open-source']),
    order: z.number().int(),
    technologies: z.array(z.string()),
    capabilities: z.array(z.string()),
    install: z.string().optional(),
    siteFigures: z.boolean().default(false),
    links: z
      .object({
        github: z.url().optional(),
        npm: z.url().optional(),
      })
      .optional(),
    demo: z
      .object({
        video: z
          .object({
            src: z.string().startsWith('/'),
            poster: z.string().startsWith('/'),
            width: z.number().int().positive(),
            height: z.number().int().positive(),
            label: z.string().min(1),
            caption: z.string().optional(),
          })
          .optional(),
        screenshots: z.array(screenshot).default([]),
      })
      .optional(),
    relatedArticles: z.array(reference('articles')).default([]),
  }),
});

export const collections = { articles, projects };
