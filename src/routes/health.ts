import { Elysia } from 'elysia';

export const health = new Elysia().get('/health', () => ({
  success: true,
  status: 'ok'
}));
