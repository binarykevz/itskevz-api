// src/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),

  DATABASE_URL: z
    .string()
    .min(1)
    .refine(
      (value) => value.startsWith('libsql://'),
      'DATABASE_URL must be a Turso/libSQL URL, e.g. libsql://your-db.turso.io'
    ),

  DATABASE_AUTH_TOKEN: z
    .string()
    .min(1, 'DATABASE_AUTH_TOKEN is required for Turso'),

  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET_NAME: z.string().min(1),
  R2_PUBLIC_URL: z.string().url(),

  ADMIN_API_KEY: z.string().min(16),

  MAX_IMAGE_SIZE: z.coerce.number().default(10 * 1024 * 1024),
  MAX_VIDEO_SIZE: z.coerce.number().default(100 * 1024 * 1024),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
