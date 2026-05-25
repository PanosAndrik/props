import { z } from "zod";

export const challengeSchema = z.object({
  name: z.string().min(1),
  accountSize: z.string().optional().nullable(),
  price: z.coerce.number().optional().nullable(),
  profitTarget: z.string().optional().nullable(),
  maxDrawdown: z.string().optional().nullable(),
  profitSplit: z.string().optional().nullable(),
  published: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export type ChallengeInput = z.infer<typeof challengeSchema>;
