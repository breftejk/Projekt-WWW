document.addEventListener('DOMContentLoaded', function () {
  const increaseFontSizeBtn = document.getElementById('increaseFontSize');
  const decreaseFontSizeBtn = document.getElementById('decreaseFontSize');

  let savedFontSize = localStorage.getItem('fontSize');
  console.log(savedFontSize)
  if (savedFontSize) {
    document.documentElement.style.fontSize = savedFontSize;
  } else {
    savedFontSize = '16px';
    localStorage.setItem('fontSize', savedFontSize);
    document.documentElement.style.fontSize = savedFontSize;
  }

  increaseFontSizeBtn.addEventListener('click', function () {
    adjustFontSize(1.1);
  });

  decreaseFontSizeBtn.addEventListener('click', function () {
    adjustFontSize(0.9);
  });

  function adjustFontSize(factor) {
    const currentFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const newFontSize = (currentFontSize * factor).toFixed(2) + 'px';
    document.documentElement.style.fontSize = `${newFontSize}`;
    localStorage.setItem('fontSize', newFontSize);
    savedFontSize = newFontSize;
  }
});