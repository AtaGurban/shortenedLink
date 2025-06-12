import { z } from "zod";

export const createShortenedLinkSchema = z.object({
  originalUrl: z.string().trim().url(),
  alias: z
    .string()
    .trim()
    .min(3)
    .max(20)
    .optional()
    .transform((val) => val?.toLowerCase()),
  expiresAt: z.coerce.date().optional(),
});

export type CreateShortenedLinkBody = z.infer<typeof createShortenedLinkSchema>;

export const getShortenedLinksQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(25),
  page: z.coerce.number().min(1).default(1),
});

export type GetShortenedLinks = z.infer<typeof getShortenedLinksQuerySchema>;
