import "dotenv/config";
import { z } from "zod";
import type { StringValue } from "ms";

const durationSchema = z.custom<StringValue>(
  (value) => typeof value === "string",
  {
    message: "Invalid duration format",
  },
);

const envSchema = z.object({
  NODE_ENV: z.enum([
    "development",
    "test",
    "production",
  ]),

  PORT: z.coerce.number().default(5000),

  DATABASE_URL: z.string().min(1),

  JWT_SECRET: z.string().min(10),

  JWT_REFRESH_SECRET: z.string().min(10),
  JWT_ACCESS_EXPIRES_IN: durationSchema,

  JWT_REFRESH_EXPIRES_IN: durationSchema,

  JWT_REFRESH_EXPIRES_IN_DAYS: z.coerce.number().positive(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables");
  console.error(parsed.error.format());
  process.exit(1);
}


export const env = parsed.data;