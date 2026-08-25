import { Elysia, t } from 'elysia';
import { adminAuth } from '../middleware/auth';
import { uploadMedia, deleteMedia, getMedia, listMedia } from '../services/media';
import { getRandomMedia } from '../services/random';
import { paginationQuery, randomQuery } from '../utils/validation';

export const videos = new Elysia({ prefix: '/api/videos' })
  .get('/', ({ query }) => listMedia('video', query.page, query.pageSize), {
    query: paginationQuery
  })
  .get('/random', async ({ query }) => {
    const data = await getRandomMedia('video', query.limit);
    return { success: true, count: data.length, data };
  }, {
    query: randomQuery
  })
  .get('/:id', async ({ params }) => {
    const data = await getMedia('video', params.id);
    return { success: true, data };
  })
  .group('', (app) => app
    .use(adminAuth)
    .post('/', async ({ body }) => {
      const data = await uploadMedia('video', body.file, body.title, body.description);
      return { success: true, data };
    }, {
      body: t.Object({
        file: t.File(),
        title: t.Optional(t.String()),
        description: t.Optional(t.String())
      })
    })
    .delete('/:id', async ({ params }) => {
      await deleteMedia('video', params.id);
      return { success: true, message: 'Video deleted successfully' };
    })
  );
