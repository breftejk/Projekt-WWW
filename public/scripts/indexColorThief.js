document.addEventListener("DOMContentLoaded", function() {
    const header = document.getElementById("header");
    const topMovieSection = document.querySelector(".topMovie");
    const movieImage = topMovieSection.querySelector("img");

    if (!header || !topMovieSection || !movieImage) {
        console.error("Header, topMovie section, or movie image not found");
        return;
    }

    fetch(movieImage.src, { mode: 'cors' })
        .then(response => response.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            movieImage.src = url;

            movieImage.onload = function() {
                analyzeImage(movieImage);
            };
        })
        .catch(err => {
            console.error("Failed to fetch image due to CORS issues:", err);
        });

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
});