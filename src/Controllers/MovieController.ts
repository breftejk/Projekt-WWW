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

    static async GetPopular(request: FastifyRequest, reply: FastifyReply) {
        const popular = await MovieService.getPopular();
        return reply.send(popular);
    }
}

export default MovieController;