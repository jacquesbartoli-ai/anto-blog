import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    type: z.enum(['recette', 'metier']),
    heroImage: z.string(),
    publishedDate: z.string(),
    author: z.string().default('Jacques Bartoli'),
  }),
});

export const collections = { articles };
