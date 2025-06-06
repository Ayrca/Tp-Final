const loginForm = document.getElementById("modalLoginForm");
const emailInput = document.getElementById("modalEmail");
const passwordInput = document.getElementById("modalPassword");
const forgotPasswordLink = document.getElementById("modalForgotPassword");

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
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

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const user = usuarios.find(u => u.email === email && u.password === password);

    if (!user) {
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: "Correo o contraseña incorrectos.",
      });
      return;
    }

    // Guardar sesión
    const currentUser = {
      isLoggedIn: true,
      email: user.email,
      nombre: user.nombre,
    };
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    // Cerrar modal
    const modalInstance = bootstrap.Modal.getInstance(document.getElementById("exampleModal"));
    modalInstance.hide();

    // Reemplazar botón de login por "Mi cuenta"
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
  });
}

/* Recuperar contraseña
if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener("click", async () => {
    const { value: email } = await Swal.fire({
      title: "Recuperar contraseña",
      input: "email",
      inputLabel: "Ingresá tu correo electrónico",
      inputPlaceholder: "ejemplo@correo.com",
      showCancelButton: true,
      confirmButtonText: "Enviar",
      cancelButtonText: "Cancelar",
    });

    if (email) {
      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      const user = usuarios.find(u => u.email === email);

      if (!user) {
        Swal.fire("No se encontró ninguna cuenta con ese correo.", "", "error");
      } else {
        Swal.fire({
          icon: "success",
          title: "Recuperación simulada",
          html: `Tu contraseña es: <b>${user.password}</b>`,
        });
      }
    }
  });
}*/