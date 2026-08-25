import { db } from '../db/client';
import { media } from '../db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { uploadToR2, deleteFromR2 } from './r2';
import { notFound, tooLarge, unsupportedMediaType, badRequest, internalError } from '../utils/errors';
import { env } from '../config/env';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

export async function uploadMedia(type: 'image' | 'video', file: File, title?: string, description?: string) {
  const allowedTypes = type === 'image' ? ALLOWED_IMAGE_TYPES : ALLOWED_VIDEO_TYPES;
  const maxSize = type === 'image' ? env.MAX_IMAGE_SIZE : env.MAX_VIDEO_SIZE;

  if (!file.type || !allowedTypes.includes(file.type)) {
    throw unsupportedMediaType(`Unsupported media type. Allowed: ${allowedTypes.join(', ')}`);
  }

  if (file.size > maxSize) {
    throw tooLarge(`File exceeds maximum size of ${maxSize} bytes`);
  }

  const ext = file.name.split('.').pop() || (type === 'image' ? 'bin' : 'bin');
  const safeExt = ext.toLowerCase().replace(/[^a-z0-9]/g, '');
  const r2Key = `${type}s/${crypto.randomUUID()}.${safeExt}`;
  const url = `${env.R2_PUBLIC_URL}/${r2Key}`;

  const arrayBuffer = await file.arrayBuffer();
  const body = new Uint8Array(arrayBuffer);

  try {
    await uploadToR2(r2Key, body, file.type);
  } catch (err) {
    console.error('R2 Upload failed:', err);
    throw badRequest('Failed to upload file to storage');
  }

  const dbInsert = {
    id: crypto.randomUUID(),
    type,
    filename: r2Key.split('/').pop()!,
    originalFilename: file.name,
    mimeType: file.type,
    size: file.size,
    r2Key,
    url,
    title,
    description
  };

  try {
    await db.insert(media).values(dbInsert);
  } catch (err) {
    console.error('DB Insert failed, rolling back R2 upload:', err);
    try {
      await deleteFromR2(r2Key);
    } catch (cleanupErr) {
      console.error('Failed to clean up R2 object:', cleanupErr);
    }
    throw badRequest('Failed to save media metadata');
  }

  return dbInsert;
}

export async function deleteMedia(type: 'image' | 'video', id: string) {
  const existing = await db.select().from(media).where(eq(media.id, id)).limit(1);
  
  if (existing.length === 0) {
    throw notFound('Media not found');
  }

  const record = existing[0];
  if (record.type !== type) {
    throw notFound(`Media is not a ${type}`);
  }

  try {
    await deleteFromR2(record.r2Key);
  } catch (err) {
    console.error('R2 Deletion failed:', err);
    throw internalError('Failed to delete media from storage');
  }

  await db.delete(media).where(eq(media.id, id));
}

export async function getMedia(type: 'image' | 'video', id: string) {
  const existing = await db.select().from(media).where(eq(media.id, id)).limit(1);
  if (existing.length === 0 || existing[0].type !== type) {
    throw notFound('Media not found');
  }
  return existing[0];
}

export async function listMedia(type: 'image' | 'video', page: number, pageSize: number) {
  const offset = (page - 1) * pageSize;
  
  const [results, countResult] = await Promise.all([
    db.select().from(media)
      .where(eq(media.type, type))
      .orderBy(desc(media.createdAt))
      .limit(pageSize)
      .offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(media).where(eq(media.type, type))
  ]);

  return {
    success: true,
    data: results,
    meta: {
      page,
      pageSize,
      total: Number(countResult[0].count)
    }
  };
}
