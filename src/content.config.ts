import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORIES, type Category } from './consts';

const categories = [...CATEGORIES] as [Category, ...Category[]];

// One Markdown file per project in src/content/projects (SP-103).
// Adding a project = one .md file (+ media in public/), no code changes.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z
    .object({
      title: z.string(),
      summary: z.string().max(160),
      status: z.enum(['online', 'in-sviluppo']),
      category: z.enum(categories),
      tech: z.array(z.string()).min(1),
      links: z
        .object({
          demo: z.url().optional(),
          code: z.url().optional(),
          article: z.string().optional(),
        })
        .default({}),
      // Desktop software: "Scarica <label>" buttons, e.g. to a GitHub release.
      downloads: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
      // Path under public/, e.g. /media/nextep.webp
      cover: z.string().optional(),
      // Short MP4/WebM demo (15–30 s), path under public/ or absolute URL.
      video: z.string().optional(),
      featured: z.boolean().default(false),
      order: z.number().default(100),
      // Drafts are visible in `astro dev` only.
      draft: z.boolean().default(false),
    })
    // PRD rule: a project is never published without a demo or a video.
    .refine((p) => p.draft || p.links.demo || p.video, {
      message: 'A published project needs links.demo or video (or draft: true).',
    }),
});

// English translations (SP-108): same file name as the Italian project, only the text.
// Media, links, tech and order always come from the Italian file.
const projectsEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects-en' }),
  schema: z.object({
    title: z.string().optional(),
    summary: z.string().max(160),
    // Demo in the other language, when the app has one (e.g. WanderWish /it vs /).
    demo: z.url().optional(),
  }),
});

// Technical articles (SP-106), in Italian; English translations in articles-en with the same file name.
const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(220),
    date: z.coerce.date(),
    // Id of the related project (file name in src/content/projects).
    project: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const articlesEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles-en' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(220),
  }),
});

export const collections = { projects, projectsEn, articles, articlesEn };
