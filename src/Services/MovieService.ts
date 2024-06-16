import {
  MovieSearch,
  ImageSearch,
  MovieDetails,
  VideoSearch,
  MovieCreditsSearch,
  WhereToWatch
} from '../Models/MovieModel';
import TMDbAPIClient from '../Utils/TMDbAPIClient';

class MovieService {
  static async search(query: string): Promise<MovieSearch[]> {
    const response = await TMDbAPIClient.get<{ results: MovieSearch[] }>(
      'search/movie',
      {
        params: {
          query
        }
      }
    );

    return response.data.results;
  }

  static async getDetails(movieId: string): Promise<{
    movie: MovieDetails;
    images: ImageSearch;
    videos: VideoSearch;
    credits: MovieCreditsSearch;
    similar: {
      results: MovieSearch[];
    };
    providers: WhereToWatch;
  }> {
    const details = await TMDbAPIClient.get<MovieDetails>(`/movie/${movieId}`);

    const images = await TMDbAPIClient.get<ImageSearch>(
      `/movie/${movieId}/images`
    );
    const videos = await TMDbAPIClient.get<VideoSearch>(
      `/movie/${movieId}/videos`
    );

    const credits = await TMDbAPIClient.get<MovieCreditsSearch>(
      `/movie/${movieId}/credits`
    );

    const similar = await TMDbAPIClient.get<{
      results: MovieSearch[];
    }>(`/movie/${movieId}/similar`);

    const providers = await TMDbAPIClient.get<WhereToWatch>(
      `/movie/${movieId}/watch/providers`
    );

    return {
      movie: details.data,
      images: images.data,
      videos: videos.data,
      credits: credits.data,
      similar: similar.data,
      providers: providers.data
    };
  }

  static async getTopRated(): Promise<MovieSearch[]> {
    const response = await TMDbAPIClient.get<{ results: MovieSearch[] }>(
      'movie/top_rated'
    );
    return response.data.results;
  }

  static async getPopular(): Promise<MovieSearch[]> {
    const response = await TMDbAPIClient.get<{ results: MovieSearch[] }>(
      'movie/popular'
    );
    return response.data.results;
  }

  static async getNowPlaying(): Promise<MovieSearch[]> {
    const response = await TMDbAPIClient.get<{ results: MovieSearch[] }>(
      'movie/now_playing'
    );
    return response.data.results;
  }

  static async getUpcoming(): Promise<MovieSearch[]> {
    const response = await TMDbAPIClient.get<{ results: MovieSearch[] }>(
      'movie/upcoming'
    );
    return response.data.results;
  }
}

export default MovieService;
