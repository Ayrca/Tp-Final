function actualizarHeaderSegunUsuario() {
  try {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser?.isLoggedIn) {
      // Cambiar botón de login a "Mi cuenta"
      const loginBtn = document.querySelector("button[data-bs-target='#exampleModal']");
      if (loginBtn) {
        loginBtn.outerHTML = `
          <a href="/pages/mi-cuenta.html" class="btn btn-outline-success">
            Mi cuenta
          </a>
        `;
      }
      // Mostrar botones admin
      if (currentUser.isAdmin) {
        ['btnAdmin1', 'btnAdmin2', 'btnAdmin3'].forEach(id => {
          const btn = document.getElementById(id);
          if (btn) btn.classList.remove('d-none');
        });
      }
    }
  } catch (e) {
    console.error('Error al actualizar header:', e);
  }
}

// Inicialización general
function inicializarLoginHeader() {
  actualizarHeaderSegunUsuario();

  const loginForm = document.getElementById("modalLoginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.getElementById("modalEmail").value.trim();
      const password = document.getElementById("modalPassword").value.trim();

      if (!email || !password) {
        if (typeof Swal !== 'undefined') {
          Swal.fire({
            icon: "warning",
            title: "Campos vacíos",
            text: "Por favor, completá todos los campos."
          });
        }
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
          if (typeof Swal !== 'undefined') {
            Swal.fire({
              icon: "error",
              title: "Error al iniciar sesión",
              text: data.error || "Correo o contraseña incorrectos."
            });
          }
          return;
        }

        if (data.estadoCuenta === false) {
          if (typeof Swal !== 'undefined') {
            Swal.fire({
              icon: "error",
              title: "Cuenta inactiva",
              text: "Tu cuenta está inactiva. Contactá al administrador."
            });
          }
          return;
        }

        data.isLoggedIn = true;
        localStorage.setItem("currentUser", JSON.stringify(data));

        // Cerrar modal
        const modalEl = document.getElementById("exampleModal");
        if (modalEl) {
          const modalInstance = bootstrap.Modal.getInstance(modalEl);
          if (modalInstance) modalInstance.hide();
        }

        actualizarHeaderSegunUsuario();

        if (typeof Swal !== 'undefined') {
          Swal.fire({
            icon: "success",
            title: `¡Bienvenido, ${data.nombre}!`,
            timer: 1500,
            showConfirmButton: false
          });
        }

      } catch (error) {
        console.error('Error en login:', error);
        if (typeof Swal !== 'undefined') {
          Swal.fire({
            icon: "error",
            title: "Error de conexión",
            text: "No se pudo conectar con el servidor."
          });
        }
      }
    });
  }
}

// Espera a que se cargue TODO el HTML (incluido el header por fetch)
document.addEventListener("DOMContentLoaded", () => {
  const intervalo = setInterval(() => {
    if (document.getElementById("modalLoginForm")) {
      inicializarLoginHeader();
      clearInterval(intervalo);
    }
  }, 500);
});