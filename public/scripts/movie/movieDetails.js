const PROXY_URL = '/api/movie/image';

document.addEventListener('DOMContentLoaded', function () {
  if (window.innerWidth < 768) return;

  const leftPanel = document.querySelector('.left-panel');

  function adjustLeftPanelPosition() {
    const container = document.querySelector('.movie-details-container');
    const containerRect = container.getBoundingClientRect();
    const leftPanelRect = leftPanel.getBoundingClientRect();

    if (containerRect.bottom < leftPanelRect.bottom) {
      leftPanel.style.position = 'absolute';
      leftPanel.style.bottom = '0';
      leftPanel.style.top = 'initial';
    } else {
      leftPanel.style.position = 'sticky';
      leftPanel.style.top = '100px';
      leftPanel.style.bottom = 'initial';
    }
  }

  window.addEventListener('scroll', adjustLeftPanelPosition);
  window.addEventListener('resize', adjustLeftPanelPosition);
  adjustLeftPanelPosition();
});

document.addEventListener('DOMContentLoaded', function () {
  const movieId = window.location.hash.substring(1); // Get movie ID from URL hash

  console.log(movieId);

  if (movieId) {
    fetchMovieDetails(movieId);
  }

  async function fetchMovieDetails(id) {
    try {
      const res = await fetch(`/api/movie/details?id=${id}`);
      const movie = await res.json();
      updateMovieDetails(movie);
    } catch (error) {
      console.error('Failed to fetch movie details:', error);
    }
  }

  function updateMovieDetails(movie) {
    console.log(movie);
    // Update the left panel
    const moviePoster = document.querySelector('.movie-poster');
    const movieDetails = document.querySelector('.movie-details');

    if (moviePoster) {
      moviePoster.src = `${PROXY_URL}${movie.movie.poster_path}`;
      moviePoster.alt = movie.movie.title;
    }

    if (movieDetails) {
      let detailsHTML = `<h2>${movie.movie.title}</h2>`;

      if (movie.movie.tagline) {
        detailsHTML += `<p>${movie.movie.tagline}</p>`;
      }

      movieDetails.innerHTML = detailsHTML;
    }

    // Update the right panel
    const movieDescription = document.querySelector('.movie-description');
    const photoGallery = document.querySelector('.photo-gallery');
    const largeVideoGallery = document.querySelector('.large-video-gallery');
    const smallVideoGallery = document.querySelector('.small-video-gallery');
    const castGallery = document.querySelector('.cast-gallery');
    const similarGallery = document.querySelector('.similar-gallery');
    const whereToWatch = document.querySelector('.where-to-watch');

    if (movieDescription) {
      if (movie.movie.overview && movie.movie.overview.trim() !== '') {
        movieDescription.querySelector('p').innerHTML =
          `<p>${movie.movie.overview}</p><hr style="color:rgba(0,0,0,0.26)" />`;

        if (movie.movie.release_date) {
          movieDescription.querySelector('p').innerHTML +=
            `<p>Release Date: ${movie.movie.release_date}</p>`;
        }
        if (movie.movie.vote_average) {
          movieDescription.querySelector('p').innerHTML +=
            `<p>Rating: ${movie.movie.vote_average.toFixed(1)}</p>`;
        }
        if (movie.movie.genres && movie.movie.genres.length > 0) {
          movieDescription.querySelector('p').innerHTML +=
            `<p>Genre: ${movie.movie.genres.map((genre) => genre.name).join(', ')}</p>`;
        }
        if (movie.movie.runtime) {
          movieDescription.querySelector('p').innerHTML +=
            `<p>Runtime: ${movie.movie.runtime} minutes</p>`;
        }
        if (movie.movie.budget) {
          movieDescription.querySelector('p').innerHTML +=
            `<p>Budget: $${movie.movie.budget.toLocaleString()}</p>`;
        }
        if (movie.movie.revenue) {
          movieDescription.querySelector('p').innerHTML +=
            `<p>Revenue: $${movie.movie.revenue.toLocaleString()}</p>`;
        }
      } else {
        movieDescription.style.display = 'none';
      }
    }

    if (photoGallery) {
      if (movie.images.backdrops.length > 0) {
        photoGallery.innerHTML = ''; // Clear existing photos
        movie.images.backdrops.forEach((image) => {
          const imgElement = document.createElement('img');
          imgElement.src = `${PROXY_URL}${image.file_path}`;
          imgElement.alt = `${movie.movie.title} backdrop`;
          photoGallery.appendChild(imgElement);
        });
      } else {
        photoGallery.parentElement.style.display = 'none';
      }
    }

    if (largeVideoGallery || smallVideoGallery) {
      if (movie.videos.results.length > 0) {
        largeVideoGallery.innerHTML = ''; // Clear existing large videos
        smallVideoGallery.innerHTML = ''; // Clear existing small videos
        const sortedVideos = movie.videos.results.sort((a, b) => {
          if (a.type === 'Trailer' && b.type !== 'Trailer') return -1;
          if (a.type !== 'Trailer' && b.type === 'Trailer') return 1;
          return new Date(b.published_at) - new Date(a.published_at);
        });

        sortedVideos.slice(0, 2).forEach((video) => {
          const iframeElement = document.createElement('iframe');
          iframeElement.src = `https://www.youtube.com/embed/${video.key}`;
          iframeElement.frameBorder = 0;
          iframeElement.allowFullscreen = true;
          iframeElement.classList.add('large-video');
          largeVideoGallery.appendChild(iframeElement);
        });

        sortedVideos.slice(2, 10).forEach((video) => {
          const iframeElement = document.createElement('iframe');
          iframeElement.src = `https://www.youtube.com/embed/${video.key}`;
          iframeElement.frameBorder = 0;
          iframeElement.allowFullscreen = true;
          iframeElement.classList.add('small-video');
          smallVideoGallery.appendChild(iframeElement);
        });
      } else {
        largeVideoGallery.parentElement.style.display = 'none';
        smallVideoGallery.parentElement.style.display = 'none';
      }
    }

    if (castGallery) {
      if (movie.credits.cast.length > 0) {
        castGallery.innerHTML = ''; // Clear existing cast members
        movie.credits.cast
          .filter(
            (actor) =>
              actor.character !== null &&
              actor.character !== undefined &&
              actor.profile_path
          )
          .slice(0, 8)
          .forEach((actor) => {
            const actorElement = document.createElement('div');
            actorElement.classList.add('actor');
            actorElement.innerHTML = `
                        <img src="${PROXY_URL}${actor.profile_path}" alt="${actor.name}">
                        <p>${actor.name} as ${actor.character}</p>
                    `;
            castGallery.appendChild(actorElement);
          });
      } else {
        castGallery.parentElement.style.display = 'none';
      }
    }

    if (similarGallery) {
      if (movie.similar && movie.similar.results.length > 0) {
        similarGallery.innerHTML = '';
        movie.similar.results.slice(0, 8).forEach((similar) => {
          const similarElement = document.createElement('div');
          similarElement.classList.add('similar');
          similarElement.innerHTML = `
                        <a href="/movie.html#${similar.id}" target="_blank">
                            <img src="${PROXY_URL}${similar.poster_path}" alt="${similar.title}">
                            <p>${similar.title}</p>
                        </a>
                    `;
          similarGallery.appendChild(similarElement);
        });
      } else {
        similarGallery.parentElement.style.display = 'none';
      }
    }

    if (whereToWatch) {
      const watchData = movie.providers.results['PL'];
      if (watchData) {
        let watchHTML = `<h3>Where to Watch</h3>`;
        watchHTML += `<p><a href="${watchData.link}" target="_blank">More Info</a></p>`;

        if (watchData.flatrate && watchData.flatrate.length > 0) {
          watchHTML += `<h4>Streaming</h4>`;
          watchData.flatrate.forEach((provider) => {
            watchHTML += `<img src="${PROXY_URL}${provider.logo_path}" alt="${provider.provider_name}" title="${provider.provider_name}">`;
          });
        }

        if (watchData.rent && watchData.rent.length > 0) {
          watchHTML += `<h4>Rent</h4>`;
          watchData.rent.forEach((provider) => {
            watchHTML += `<img src="${PROXY_URL}${provider.logo_path}" alt="${provider.provider_name}" title="${provider.provider_name}">`;
          });
        }

        if (watchData.buy && watchData.buy.length > 0) {
          watchHTML += `<h4>Buy</h4>`;
          watchData.buy.forEach((provider) => {
            watchHTML += `<img src="${PROXY_URL}${provider.logo_path}" alt="${provider.provider_name}" title="${provider.provider_name}">`;
          });
        }

        console.log(watchHTML);
        whereToWatch.innerHTML = watchHTML;
      } else {
        whereToWatch.style.display = 'none';
      }
    }
  }
});
