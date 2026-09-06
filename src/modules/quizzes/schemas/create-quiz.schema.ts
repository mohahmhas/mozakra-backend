import { z } from "zod";

export const createQuizSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200),

  description: z
    .string()
    .trim()
    .max(1000)
    .optional(),

  passingScore: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional(),
});
