import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const insights = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/insights' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    lang: z.enum(['zh', 'en']).default('zh'),
    category: z.string().default('Industrial AI'),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(true),
  }),
});

export const collections = { insights };
