document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById('contactForm');

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    let valid = true;

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');

    if (!name.value) {
      nameError.style.display = 'block';
      valid = false;
    } else {
      nameError.style.display = 'none';
    }

    if (!email.value || !validateEmail(email.value)) {
      emailError.style.display = 'block';
      valid = false;
    } else {
      emailError.style.display = 'none';
    }

    if (!message.value) {
      messageError.style.display = 'block';
      valid = false;
    } else {
      messageError.style.display = 'none';
    }

    if (valid) {
      form.reset();

      nameError.style.display = 'none';
      emailError.style.display = 'none';
      messageError.style.display = 'none';

      alert(":)");
    }
  });

  function validateEmail(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
  }
});