import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().max(50).optional(),
    bio: z.string().max(255).optional(),
    location: z.string().max(100).optional(),
    skills: z.array(z.string().max(30)).max(15).optional(),
    socialLinks: z
      .object({
        website: z.string().url().max(100).optional().or(z.literal('')),
        github: z.string().url().max(100).optional().or(z.literal('')),
        twitter: z.string().url().max(100).optional().or(z.literal('')),
        linkedin: z.string().url().max(100).optional().or(z.literal('')),
      })
      .optional(),
  }),
});
