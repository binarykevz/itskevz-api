import { Elysia, t } from 'elysia';
import { adminAuth } from '../middleware/auth';
import { uploadMedia, deleteMedia, getMedia, listMedia } from '../services/media';
import { getRandomMedia } from '../services/random';
import { paginationQuery, randomQuery } from '../utils/validation';

export const images = new Elysia({ prefix: '/api/images' })
  .get('/', ({ query }) => listMedia('image', query.page, query.pageSize), {
    query: paginationQuery
  })
  .get('/random', async ({ query }) => {
    const data = await getRandomMedia('image', query.limit);
    return { success: true, count: data.length, data };
  }, {
    query: randomQuery
  })
  .get('/:id', async ({ params }) => {
    const data = await getMedia('image', params.id);
    return { success: true, data };
  })
  .group('', (app) => app
    .use(adminAuth)
    .post('/', async ({ body }) => {
      const data = await uploadMedia('image', body.file, body.title, body.description);
      return { success: true, data };
    }, {
      body: t.Object({
        file: t.File(),
        title: t.Optional(t.String()),
        description: t.Optional(t.String())
      })
    })
    .delete('/:id', async ({ params }) => {
      await deleteMedia('image', params.id);
      return { success: true, message: 'Image deleted successfully' };
    })
  );
