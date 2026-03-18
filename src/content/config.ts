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
    role: z.string(),
    challenges: z.array(z.string()),
    solutions: z.array(z.string()),
    coreTech: z.string(),
    order: z.number(),
    gallery: z.array(z.object({
      image: z.string(),
      description: z.string()
    })).optional(),
  }),
});

export const collections = { projects };
