import { z } from 'zod';

export const updateCourseSchema = z.object({
 title: z
    .string()
    .trim()
    .min(3)
    .max(200)
    .optional(),

  description: z
    .string()
    .trim()
    .max(5000)
    .optional(),

  thumbnail: z
    .string()
    .url()
    .optional(),

  price: z
    .number()
    .min(0)
    .optional(),

  isPublished: z
    .boolean()
    .optional(),
});
export type UpdateCourseInput =
  z.infer<typeof updateCourseSchema>;