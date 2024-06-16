import axios, { AxiosInstance } from 'axios';

const TMDbAPIClient: AxiosInstance = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MjZkMjRmYWNlYjFlM2NmNDUxYWVlYWE4NGEyMGE1MSIsInN1YiI6IjY2NTg3OGU5NDRjNTlmOTdiZTc0ZTQ0NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SJ9UwTRZ2d4DH3G8Xvywwa4q7n7nw1wC9xDfTwTzpTA'
  },
  params: {
    language: 'en-US'
  }
});

export default TMDbAPIClient;
