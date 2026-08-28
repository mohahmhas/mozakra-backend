import { z } from 'zod'

export const createCourseSchema = z.object({
   title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters long.')
    .max(200, 'Title must not exceed 200 characters.'),

      description: z
    .string()
    .trim()
    .max(5000, 'Description must not exceed 5000 characters.')
    .optional(),

  thumbnail: z
    .string()
    .url('Thumbnail must be a valid URL.')
    .optional(),

  price: z
    .number()
    .min(0, 'Price cannot be negative.')
    .default(0),
});


export type CreateCourseInput = z.infer<typeof createCourseSchema>;