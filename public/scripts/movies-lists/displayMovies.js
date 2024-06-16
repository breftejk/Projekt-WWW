function displayMovies(movies) {
  const moviesGrid = document.getElementById('moviesGrid');

  if (movies.length === 0) {
    moviesGrid.innerHTML += '<p>No movies in this list.</p>';
  } else {
    movies.forEach(async (movieId) => {
      const res = await fetch(`/api/movie/details?id=${movieId}`);
      const movie = (await res.json()).movie;
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
}
