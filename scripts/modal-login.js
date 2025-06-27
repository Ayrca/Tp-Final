const loginForm = document.getElementById("modalLoginForm");
const emailInput = document.getElementById("modalEmail");
const passwordInput = document.getElementById("modalPassword");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Por favor, completá todos los campos.",
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Error al iniciar sesión",
          text: data.error || "Correo o contraseña incorrectos.",
        });
        return;
      }

      // Usuario correcto
      const user = data;

      user.isLoggedIn = true;
      localStorage.setItem("currentUser", JSON.stringify(user));

      const modalInstance = bootstrap.Modal.getInstance(document.getElementById("exampleModal"));
      modalInstance.hide();

      const loginBtn = document.querySelector("button[data-bs-target='#exampleModal']");
      if (loginBtn) {
        loginBtn.outerHTML = `
          <a href="./pages/mi-cuenta.html" class="btn btn-outline-success">
            Mi cuenta
          </a>
        `;
      }

      Swal.fire({
        icon: "success",
        title: `¡Bienvenido, ${user.nombre}!`,
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor.",
      });
      console.error(error);
    }
  });
}