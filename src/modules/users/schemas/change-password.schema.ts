import { z } from 'zod';

export const changePasswordSchema = z.object({
     currentPassword: z
      .string()
      .min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters long'),
}).refine(
    
    (data) => data.newPassword !== data.currentPassword,
    {
      message: 'New password cannot be the same as the current password',
      path: ['newPassword'],
    },
);

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;