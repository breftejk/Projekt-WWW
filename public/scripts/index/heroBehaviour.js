const PROXY_URL = '/api/movie/image';

document.addEventListener("DOMContentLoaded", function() {
    const header = document.getElementById("header");
    const topMovieSection = document.querySelector(".topMovie");
    const movieImage = topMovieSection.querySelector("img");
    const movieTitle = topMovieSection.querySelector("h1");
    const movieOverview = topMovieSection.querySelector("p");

    if (!header || !topMovieSection || !movieImage) {
        console.error("Header, topMovie section, or movie image not found");
        return;
    }

    async function updateImageAndAnalyze() {
        try {
            const res = await fetch("/api/movie/popular");
            const movies = await res.json();

            async function updateMovie() {
                const movie = movies[currentIndex];
                const imageUrl = `${PROXY_URL}${movie.backdrop_path}`;
                movieImage.crossOrigin = "Anonymous";
                movieImage.src = imageUrl;
                movieTitle.innerText = movie.title;
                movieOverview.innerText = movie.overview;

                movieImage.onload = function() {
                    analyzeImage(movieImage);
                };

                currentIndex = (currentIndex + 1) % movies.length;
            }

            let currentIndex = 0;
            setInterval(updateMovie, 10000);
            updateMovie();
        } catch (error) {
            console.error("Failed to fetch popular movies:", error);
        }
    }

    function analyzeImage(img) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
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
        let r = 0, g = 0, b = 0;
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
        return brightness > 125 ? "#000" : "#fff";
    }

    function setHeaderTextColor(color) {
        header.style.color = color;
        header.querySelectorAll("a, label").forEach(el => {
            el.style.color = color;
        });
    }

    window.addEventListener('scroll', function() {
        if (window.scrollY >= window.innerHeight * 0.96) {
            setHeaderTextColor("#000");
        } else {
            analyzeImage(movieImage);
        }
    });

    updateImageAndAnalyze();
});


document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("searchInput");
    const suggestions = document.getElementById("suggestions");

    async function searchMovies(query) {
        const res = await fetch(`/api/movie/search?title=${encodeURIComponent(query)}`);
        return res.json();
    }

    document.addEventListener("click", function(event) {
        if (!searchInput.contains(event.target) && !suggestions.contains(event.target)) {
            suggestions.innerHTML = "";
            suggestions.style.opacity = 0;
            suggestions.style.visibility = "hidden";
            searchInput.value = null;
        }
    });

    searchInput.addEventListener("input", async function() {
        const query = searchInput.value.trim();
        if (query.length > 0) {
            const results = await searchMovies(query);
            suggestions.innerHTML = results.map(movie => `
                <div data-id="${movie.id}" class="suggestions-tab">
                        <img src="/api/movie/image${movie.poster_path}" alt="${movie.title} poster">
                        <div class="suggestion-details">
                            <span class="suggestion-title">${movie.title}</span>
                            <span class="suggestion-meta">Release Date: ${movie.release_date}</span>
                            <span class="suggestion-meta">Rating: ${movie.vote_average.toFixed(1)}</span>
                        </div>
                    </div>
            `).join("");
            suggestions.style.visibility = "visible";
            suggestions.style.opacity = 1;
        } else {
            suggestions.innerHTML = "";
            suggestions.style.opacity = 0;
            suggestions.style.visibility = "hidden";
        }
    });
});