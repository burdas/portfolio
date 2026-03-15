import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    url: z.string().optional(),
    repo: z.string().optional(),
    description: z.string(),
    fullDescription: z.string(),
    tech: z.array(z.string()),
    features: z.array(z.string()),
    image: z.string(),
    duration: z.string(),
    client: z.string(),
  }),
});

export const collections = { projects };
