// src/index.ts
import { app } from './app';
import { env } from './config/env';
import { ensureDatabaseSchema } from './db/init';

async function bootstrap() {
  try {
    await ensureDatabaseSchema();
    console.log('✅ Database schema verified: media table exists in Turso.');
  } catch (error) {
    console.error('❌ Database initialization failed.');
    console.error(error);
    process.exit(1);
  }

  app.listen(env.PORT);

  console.log(`🦊 Media API is running at http://localhost:${env.PORT}`);
}

bootstrap();
