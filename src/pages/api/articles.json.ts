/**
 * Endpoint statique JSON — expose les métadonnées de tous les articles du blog.
 * Accessible à /api/articles.json (généré au build Astro).
 */

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const articles = await getCollection('articles');

  const data = articles.map((a) => ({
    slug: a.id.replace(/\.md$/, ''),
    title: a.data.title,
    description: a.data.description,
    category: a.data.category,
    type: a.data.type,
    heroImage: a.data.heroImage,
    publishedDate: a.data.publishedDate,
    author: a.data.author,
  })).sort(
    (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
