import {z, email} from "zod";

export const loginSchema = z.object({
 email:email().trim().toLowerCase(),
     password: z.string().min(8).max(100),
});

export type LoginSchema = z.infer<typeof loginSchema>;