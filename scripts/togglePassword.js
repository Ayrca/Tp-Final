function initPasswordToggle() {
const togglePassword = document.querySelector('#togglePassword');
const passwordInput = document.querySelector('#modalPassword');

if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    togglePassword.classList.toggle('fa-eye');
    togglePassword.classList.toggle('fa-eye-slash');
    });
}
}
