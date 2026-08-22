import e from 'express';
import { z } from 'zod';

export const updateUserSchema = z.object({
    name: z .string().trim().min(3).max(100).optional(),
    email: z .email().trim().toLowerCase().optional(),
    password: z .string().min(8).max(100).optional(),
});

export type UpdateUserInput =
  z.infer<typeof updateUserSchema>;
