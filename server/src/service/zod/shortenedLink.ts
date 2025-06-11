import { z } from 'zod';

export const createShortenedLinkSchema = z.object({
  originalUrl: z.string().url(),
  alias: z.string().min(3).max(20).optional(),
  expiresAt: z.string().datetime().optional(),
});

export type CreateShortenedLinkBody = z.infer<typeof createShortenedLinkSchema>;

export const getShortenedLinksQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(25),
  page: z.coerce.number().min(1).default(1),
});

export type GetShortenedLinks = z.infer<typeof getShortenedLinksQuerySchema>;