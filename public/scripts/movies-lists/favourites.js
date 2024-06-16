document.addEventListener('DOMContentLoaded', function () {
  displayFavourites();
});

function displayFavourites() {
  const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
  displayMovies(favourites);
}
