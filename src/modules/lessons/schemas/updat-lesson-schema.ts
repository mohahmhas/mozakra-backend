import { z } from 'zod';


export const updateLessonSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters')
    .optional(),

  description: z
    .string()
    .trim()
    .max(5000, 'Description must not exceed 5000 characters')
    .optional(),

  videoUrl: z
    .string()
    .url('Invalid video URL')
    .optional(),

  duration: z
    .number()
    .int('Duration must be an integer')
    .positive('Duration must be greater than 0')
    .optional(),

  order: z
    .number()
    .int('Order must be an integer')
    .positive('Order must be greater than 0')
    .optional(),
});


export type UpdateLessonInput = z.infer<
  typeof updateLessonSchema
>;