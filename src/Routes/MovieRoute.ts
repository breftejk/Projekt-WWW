import { FastifyInstance, FastifyPluginOptions } from 'fastify';

import MovieController from "../Controllers/MovieController";

const movieRoute = async (server: FastifyInstance, options: FastifyPluginOptions, done: void) => {
    server.get('/search', MovieController.Search);
    server.get('/popular', MovieController.GetPopular);
};

export default movieRoute;