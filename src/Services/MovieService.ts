import { MovieSearch, MovieDetails } from "../Models/MovieModel";
import TMDbAPIClient from "../Utils/TMDbAPIClient";

class MovieService {
    static async search(query: string): Promise<MovieSearch[]> {
        const response = await TMDbAPIClient.get<{ results: MovieSearch[] }>("movies/search", {
            params: {
                query,
            }
        });

        return response.data.results;
    }

    static async getById(movieId: string): Promise<MovieDetails> {
        const response = await TMDbAPIClient.get<MovieDetails>(`/movie/${movieId}`);
        return response.data;
    }

    static async getTopRated(): Promise<MovieSearch[]> {
        const response = await TMDbAPIClient.get<{ results: MovieSearch[] }>("movie/top_rated");
        return response.data.results;
    }

    static async getPopular(): Promise<MovieSearch[]> {
        const response = await TMDbAPIClient.get<{ results: MovieSearch[] }>("movie/popular");
        return response.data.results;
    }

    static async getNowPlaying(): Promise<MovieSearch[]> {
        const response = await TMDbAPIClient.get<{ results:MovieSearch[] }>("movie/now_playing");
        return response.data.results;
    }

    static async getUpcoming(): Promise<MovieSearch[]> {
        const response = await TMDbAPIClient.get<{ results:MovieSearch[] }>("movie/upcoming");
        return response.data.results;
    }
}

export default MovieService;