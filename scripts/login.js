const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePasswordIcon = document.querySelector(".toggle-password i");
const forgotPasswordLink = document.getElementById("forgotPassword");

//Reset de validación personalizada
function resetCustomValidity(input) {
  input.setCustomValidity("");
  input.reportValidity();
}

emailInput.addEventListener("input", () => resetCustomValidity(emailInput));
passwordInput.addEventListener("input", () => resetCustomValidity(passwordInput));

//Mostrar/ocultar contraseña
document.querySelector(".toggle-password").addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  togglePasswordIcon.classList.toggle("fa-eye");
  togglePasswordIcon.classList.toggle("fa-eye-slash");
});

// Login con validación
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email) {
    emailInput.setCustomValidity("Por favor, completa este campo.");
    emailInput.reportValidity();
    return;
  }

  if (!password) {
    passwordInput.setCustomValidity("Por favor, completa este campo.");
    passwordInput.reportValidity();
    return;
  }

  // Obtener usuarios registrados del localStorage
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const user = usuarios.find(u => u.email === email && u.password === password);

  if (!user) {
    Swal.fire({
      icon: "error",
      title: "Error al Iniciar Sesión",
      text: "Correo o contraseña incorrectos.",
      confirmButtonColor: "#6f42c1",
      customClass: {
        popup: "custom-popup",
        title: "custom-title",
        content: "custom-content",
      },
    });
    return;
  }

  //guardar la sesión
  const currentUser = {
    isLoggedIn: true,
    email: user.email,
    nombre: user.nombre,
  };
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  // Redirigimos
  window.location.href = "mi-cuenta.html";
});

//Recuperar contraseña
forgotPasswordLink.addEventListener("click", async () => {
  const { value: email } = await Swal.fire({
    title: "Recuperar contraseña",
    input: "email",
    inputLabel: "Ingresa tu correo electrónico",
    inputPlaceholder: "ejemplo@correo.com",
    confirmButtonText: "Enviar",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    inputValidator: (value) => {
      if (!value) return "¡Debes ingresar un correo!";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Correo inválido.";
    },
    customClass: {
      popup: "custom-popup",
    },
  });

  if (email) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const user = usuarios.find(u => u.email === email);

    if (!user) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `No existe una cuenta registrada con el correo: ${email}`,
        confirmButtonColor: "#6f42c1",
        customClass: {
          popup: "custom-popup",
          title: "custom-title",
          content: "custom-content",
        },
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Recuperación simulada",
        html: `<p class="swal-text">Tu contraseña es <b>${user.password}</b>.</p>`,
        confirmButtonColor: "#6f42c1",
        customClass: {
          popup: "custom-popup",
          title: "custom-title",
          content: "custom-content",
        },
      });
    }
  }
});