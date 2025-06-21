document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser?.isLoggedIn) {
    // Reemplazar botón de login por "Mi cuenta"
    const loginBtn = document.querySelector("button[data-bs-target='#exampleModal']");
    if (loginBtn) {
      loginBtn.outerHTML = `
        <a href="./pages/mi-cuenta.html" class="btn btn-outline-success">
          Mi cuenta
        </a>
      `;
    }
  }
});
