import { z } from 'zod';

export const updateProgressSchema =
  z.object({

    progress: z
      .number()
      .int()
      .min(0)
      .max(100),

  });


export type UpdateProgressInput =
  z.infer<typeof updateProgressSchema>;