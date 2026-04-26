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

const experience = defineCollection({
  type: 'content',
  schema: z.object({
    role: z.string(),
    company: z.string(),
    period: z.string(),
    description: z.string(),
    highlights: z.array(z.string()),
    order: z.number(),
    logo: z.string().optional(),
    type: z.string().optional(),
    location: z.string().optional(),
    siteUrl: z.string().url().optional(),
    technologies: z.array(z.string()).optional(),
    keyProjects: z.array(z.object({
      name: z.string(),
      description: z.string(),
      slug: z.string().optional(),
    })).optional(),
    detailedHighlights: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })).optional(),
  }),
});

const chatbot = defineCollection({
  type: 'content',
  schema: z.any(),
});

export const collections = { projects, experience, chatbot };
