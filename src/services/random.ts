// src/services/random.ts
import { db } from '../db/client';
import { media } from '../db/schema';
import { eq, sql } from 'drizzle-orm';

export async function getRandomMedia(type: 'image' | 'video', limit: number) {
  const results = await db.select().from(media)
    .where(eq(media.type, type))
    .orderBy(sql`RANDOM()`)
    .limit(limit);

  return results;
}
