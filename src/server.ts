import Fastify from 'fastify';
import FastifyStatic from '@fastify/static';
import FastifyCaching from '@fastify/caching';
import FastifyHTTPProxy from '@fastify/http-proxy';

import path from 'node:path';
import MovieRoute from './Routes/MovieRoute';

const server = Fastify();

server.register(FastifyStatic, {
  root: path.resolve(__dirname, '../public')
});

server.register(FastifyCaching, {
  privacy: FastifyCaching.privacy.PUBLIC,
  expiresIn: 3600
});

server.register(MovieRoute, { prefix: '/api/movie' });

server.register(FastifyHTTPProxy, {
  upstream: 'https://image.tmdb.org/t/p/original',
  prefix: '/api/movie/image'
});

server
  .listen({
    port: process.env.NODE_ENV === "production" ? (parseInt(process.env.PORT as string) || 80) : 3000
  })
  .then(() => {
    console.log(`http://localhost:${process.env.NODE_ENV === "production" ? (parseInt(process.env.PORT as string) || 80) : 3000}/`);
  });
