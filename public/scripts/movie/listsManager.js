document.addEventListener('DOMContentLoaded', function () {
  const movieId = window.location.hash.substring(1);

  const addToFavouritesBtn = document.getElementById('addToFavourites');
  const addToWatchlistBtn = document.getElementById('addToWatchlist');

  if (movieId) {
    updateButtonState(movieId);
  }

  addToFavouritesBtn.addEventListener('click', function () {
    toggleMovieInList('favourites', movieId);
  });

  addToWatchlistBtn.addEventListener('click', function () {
    toggleMovieInList('watchlist', movieId);
  });

  function toggleMovieInList(listName, movieId) {
    let list = JSON.parse(localStorage.getItem(listName)) || [];
    const movieIndex = list.indexOf(movieId);

    if (movieIndex > -1) {
      list.splice(movieIndex, 1);
    } else {
      list.push(movieId);
    }

    localStorage.setItem(listName, JSON.stringify(list));
    updateButtonState(movieId);
  }

  function updateButtonState(movieId) {
    const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

    if (favourites.includes(movieId)) {
      addToFavouritesBtn.textContent = 'Remove from Favourites';
      addToFavouritesBtn.classList.add('button-remove');
    } else {
      addToFavouritesBtn.textContent = 'Add to Favourites';
      addToFavouritesBtn.classList.remove('button-remove');
    }

    if (watchlist.includes(movieId)) {
      addToWatchlistBtn.textContent = 'Remove from Watchlist';
      addToWatchlistBtn.classList.add('button-remove');
    } else {
      addToWatchlistBtn.textContent = 'Add to Watchlist';
      addToWatchlistBtn.classList.remove('button-remove');
    }
  }
});
