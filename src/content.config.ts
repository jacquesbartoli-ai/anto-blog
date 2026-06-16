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
    updatedDate: z.string().optional(),
    author: z.string().default('JB'),
    // GEO — format citable : résumé en tête (réponse directe) + questions/réponses métier
    summary: z.string().optional(),
    faq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      )
      .optional(),
  }),
});

export const collections = { articles };
