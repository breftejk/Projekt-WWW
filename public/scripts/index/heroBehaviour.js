const PROXY_URL = '/api/movie/image';

document.addEventListener('DOMContentLoaded', function () {
  const header = document.getElementById('header');
  const nav = document.querySelector('nav');
  const topMovieSection = document.querySelector('.topMovie');
  const movieImage = topMovieSection.querySelector('img');
  const movieTitle = topMovieSection.querySelector('h1');
  const movieTitleLink = topMovieSection.querySelector('a#movieTitleLink');
  const movieOverview = topMovieSection.querySelector('p');
  const movieOverviewLink = topMovieSection.querySelector(
    'a#movieOverviewLink'
  );

  if (!header || !topMovieSection || !movieImage || !nav) {
    console.error('Header, topMovie section, movie image, or nav not found');
    return;
  }

  header.style.background = 'transparent';

  async function updateImageAndAnalyze() {
    try {
      const res = await fetch('/api/movie/popular');
      const movies = await res.json();

      async function updateMovie() {
        const movie = movies[currentIndex];
        const imageUrl = `${PROXY_URL}${movie.backdrop_path}`;
        movieImage.crossOrigin = 'Anonymous';
        movieImage.src = imageUrl;
        movieTitle.innerText = movie.title;
        movieTitleLink.href = `/movie.html#${movie.id}`;
        movieOverview.innerText = movie.overview;
        movieOverviewLink.href = `/movie.html#${movie.id}`;

        movieImage.onload = function () {
          analyzeImage(movieImage);
        };

        currentIndex = (currentIndex + 1) % movies.length;
      }

      let currentIndex = 0;
      setInterval(updateMovie, 10000);
      updateMovie();
    } catch (error) {
      console.error('Failed to fetch popular movies:', error);
    }
  }

  function analyzeImage(img) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    context.drawImage(img, 0, 0);

    const xStart = canvas.width / 2;
    const yStart = 0;
    const width = canvas.width / 2;
    const height = canvas.height * 0.1;

    const imageData = context.getImageData(xStart, yStart, width, height);
    const dominantColor = getAverageColor(imageData.data);
    const textColor = getTextColorBasedOnBgColor(dominantColor);
    setHeaderTextColor(textColor);
  }

  function getAverageColor(data) {
    let r = 0,
      g = 0,
      b = 0;
    const pixelCount = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }

    r = Math.floor(r / pixelCount);
    g = Math.floor(g / pixelCount);
    b = Math.floor(b / pixelCount);

    return [r, g, b];
  }

  function getTextColorBasedOnBgColor([r, g, b]) {
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    // Increased threshold for better tolerance to bright colors
    return brightness > 200 ? '#000' : '#fff';
  }

  function invertColor(hex) {
    hex = hex.slice(1); // Remove '#' character
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    const inverted =
      (255 - r).toString(16).padStart(2, '0') +
      (255 - g).toString(16).padStart(2, '0') +
      (255 - b).toString(16).padStart(2, '0');
    return `#${inverted}`;
  }

  function setHeaderTextColor(color) {
    header.style.color = color;
    header.querySelectorAll('a, label').forEach((el) => {
      el.style.color = color;
    });
    const navUl = nav.querySelector('ul');
    const bgColor = color === '#000' ? '#fff' : '#000'; // Basic inversion for black/white
    navUl.style.backgroundColor = bgColor;
  }

  window.addEventListener('scroll', function () {
    if (window.scrollY >= window.innerHeight * 0.96) {
      setHeaderTextColor('#000');
      header.style.background = '#fff';
    } else {
      analyzeImage(movieImage);
      header.style.background = 'transparent';
    }
  });

  updateImageAndAnalyze();
});

document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('searchInput');
  const suggestions = document.getElementById('suggestions');

  async function searchMovies(query) {
    const res = await fetch(
      `/api/movie/search?title=${encodeURIComponent(query)}`
    );
    return res.json();
  }

  document.addEventListener('click', function (event) {
    if (
      !searchInput.contains(event.target) &&
      !suggestions.contains(event.target)
    ) {
      suggestions.innerHTML = '';
      suggestions.classList.remove('visible');
      suggestions.classList.add('hidden');
      searchInput.value = null;
    }
  });

  searchInput.addEventListener('input', async function () {
    const query = searchInput.value.trim();
    if (query.length > 0) {
      const results = await searchMovies(query);
      suggestions.innerHTML = results
        .map(
          (movie) => `
                <div data-id="${movie.id}" class="suggestions-tab">
                    <img src="/api/movie/image${movie.poster_path}" alt="${movie.title} poster">
                    <div class="suggestion-details">
                        <span class="suggestion-title">${movie.title}</span>
                        <span class="suggestion-meta">Release Date: ${movie.release_date}</span>
                        <span class="suggestion-meta">Rating: ${movie.vote_average.toFixed(1)}</span>
                    </div>
                </div>
            `
        )
        .join('');
      suggestions.classList.add('visible');
      suggestions.classList.remove('hidden');
    } else {
      suggestions.innerHTML = '';
      suggestions.classList.remove('visible');
      suggestions.classList.add('hidden');
    }
  });

  suggestions.addEventListener('click', function (event) {
    const suggestionTab = event.target.closest('.suggestions-tab');
    if (suggestionTab) {
      const movieId = suggestionTab.getAttribute('data-id');
      console.log('Clicked movie ID:', movieId);
      location.href = `/movie.html#${movieId}`;
    }
  });
});
