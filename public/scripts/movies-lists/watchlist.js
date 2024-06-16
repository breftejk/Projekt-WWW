document.addEventListener('DOMContentLoaded', function () {
  displayWatchlist();
});

function displayWatchlist() {
  const favourites = JSON.parse(localStorage.getItem('watchlist')) || [];
  displayMovies(favourites);
}
