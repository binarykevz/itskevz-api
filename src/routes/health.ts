// src/routes/health.ts
import { Elysia } from 'elysia';

export const health = new Elysia()
  .get('/', () => ({
    success: true,
    message: 'Media API is running'
  }))
  .get('/health', () => ({
    success: true,
    status: 'ok'
  }));
