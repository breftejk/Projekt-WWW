async function fetchPopularMovies() {
  try {
    const res = await fetch('/api/movie/popular');
    const data = await res.json();
    displayMovies(data);
  } catch (error) {
    console.error('Failed to fetch popular movies:', error);
  }
}

async function fetchUpcomingMovies() {
  try {
    const res = await fetch('/api/movie/upcoming');
    const data = await res.json();
    displayMovies(data);
  } catch (error) {
    console.error('Failed to fetch upcoming movies:', error);
  }
}

async function fetchTopRatedMovies() {
  try {
    const res = await fetch('/api/movie/top-rated');
    const data = await res.json();
    displayMovies(data);
  } catch (error) {
    console.error('Failed to fetch upcoming movies:', error);
  }
}

async function fetchNowPlayingMovies() {
  try {
    const res = await fetch('/api/movie/now-playing');
    const data = await res.json();
    displayMovies(data);
  } catch (error) {
    console.error('Failed to fetch now playing movies:', error);
  }
}

function displayMovies(movies) {
  const moviesGrid = document.getElementById('moviesGrid');
  moviesGrid.innerHTML = '';

  movies.forEach((movie) => {
    const movieItem = document.createElement('div');
    movieItem.classList.add('movie-item');
    movieItem.innerHTML = `
            <img src="/api/movie/image${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>Rating: ${movie.vote_average}</p>
        `;
    movieItem.addEventListener('click', () => {
      window.location.href = `/movie.html#${movie.id}`;
    });
    moviesGrid.appendChild(movieItem);
  });
}
