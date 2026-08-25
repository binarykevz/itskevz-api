import { app } from './app';
import { env } from './config/env';

app.listen(env.PORT);

console.log(`🦊 Media API is running at http://localhost:${env.PORT}`);
