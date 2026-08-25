import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { env } from '../config/env';

export const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

export async function uploadToR2(key: string, body: Uint8Array, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  await r2.send(command);
}

export async function deleteFromR2(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: key,
  });
  await r2.send(command);
}
