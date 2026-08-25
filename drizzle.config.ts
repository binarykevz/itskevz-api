// drizzle.config.ts
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const databaseUrl = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

if (!databaseUrl || !databaseUrl.startsWith('libsql://')) {
  throw new Error('DATABASE_URL must be a Turso/libSQL URL: libsql://...');
}

if (!authToken) {
  throw new Error('DATABASE_AUTH_TOKEN is required for Turso');
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: databaseUrl,
    authToken,
  },
});
