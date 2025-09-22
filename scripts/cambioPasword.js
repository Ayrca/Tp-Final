const tokenInput = document.getElementById('confirmar-Token');
const newPasswordInput = document.getElementById('newPassword');
const confirmPasswordInput = document.getElementById('confirmar-password');
const changePasswordButton = document.getElementById('change-password-button');
const usuarioTexto = document.querySelector('h2');
tokenInput.addEventListener('input', () => {
  const token = tokenInput.value;
  fetch('/validar-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Obtener el correo del usuario
      const usuario = data.usuario;
      usuarioTexto.textContent = `Cambio de contraseña: ${usuario}`;
      // Habilitar el cambio de contraseña
      newPasswordInput.disabled = false;
      confirmPasswordInput.disabled = false;
       Swal.fire({
        icon: 'success',
        title: 'Token válido',
        text: 'El token es correcto, puedes cambiar tu contraseña',
      });
    } else {
      // Mostrar mensaje de error
      mostrarError(data.error);
      newPasswordInput.disabled = true;
      confirmPasswordInput.disabled = true;
    }
  })
  .catch(error => console.error(error));
});
function mostrarError(mensaje) {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: mensaje,
  });
}
changePasswordButton.addEventListener('click', (e) => {
  e.preventDefault();
  const token = document.getElementById('confirmar-Token').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmar-password').value;
  if (newPassword === confirmPassword) {
    fetch('/cambiar-contrasena', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Contraseña cambiada',
          text: 'La contraseña ha sido cambiada con éxito',
        });
        setTimeout(() => {
          window.location.href = '../index.html';
        }, 2000); // Redireccionar después de 2 segundos
      } else {
        mostrarError(data.error);
      }
    })
    .catch(error => {
      mostrarError('Error al cambiar la contraseña');
      console.error(error);
    });
  } else {
    mostrarError('Las contraseñas no coinciden');
  }
});


