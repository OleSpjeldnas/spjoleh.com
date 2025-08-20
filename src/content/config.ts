import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    published: z.date(),
    location: z.string().optional(),
    summary: z.string().optional(),
    hero: z.string().optional(), // path under /src/assets/articles/
  }),
});

export const collections = { articles };


