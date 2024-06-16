import { FastifyReply, FastifyRequest } from "fastify";

import MovieService from "../Services/MovieService";

class MovieController {
    static async Search(request: FastifyRequest<{
        Querystring: {
            title: string;
        }
    }>, reply: FastifyReply) {
        const { title } = request.query;
        if(!title) throw new Error("No title presented in body");
        const movie = await MovieService.search(title);
        return reply.send(movie);
    }

    static async GetDetails(request: FastifyRequest<{
        Querystring: {
            id: string;
        }
    }>, reply: FastifyReply) {
        const { id } = request.query;
        if(!id) throw new Error("No id presented in body");
        const movie = await MovieService.getDetails(id);
        return reply.send(movie);
    }

    static async GetPopular(request: FastifyRequest, reply: FastifyReply) {
        const popular = await MovieService.getPopular();
        return reply.send(popular);
    }

    static async GetNowPlaying(request: FastifyRequest, reply: FastifyReply) {
        const nowPlaying = await MovieService.getNowPlaying();
        return reply.send(nowPlaying);
    }

    static async GetTopRated(request: FastifyRequest, reply: FastifyReply) {
        const topRated = await MovieService.getTopRated();
        return reply.send(topRated);
    }

    static async GetUpcoming(request: FastifyRequest, reply: FastifyReply) {
        const upcoming = await MovieService.getUpcoming();
        return reply.send(upcoming);
    }
}

export default MovieController;