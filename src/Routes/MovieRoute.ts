import { FastifyInstance, FastifyPluginOptions } from 'fastify';

import MovieController from "../Controllers/MovieController";

const movieRoute = async (server: FastifyInstance, options: FastifyPluginOptions) => {
    server.get('/search', MovieController.Search);
    server.get('/details', MovieController.GetDetails);
    server.get('/popular', MovieController.GetPopular);
    server.get('/now-playing', MovieController.GetNowPlaying);
    server.get('/top-rated', MovieController.GetTopRated);
    server.get('/upcoming', MovieController.GetUpcoming);
};

export default movieRoute;