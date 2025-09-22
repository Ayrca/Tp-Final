

  fetch("/pages/header.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("header-container").innerHTML = data;
    const botonEnviarPass = document.getElementById('botonEnviarPass');
    const recuperarEmail = document.getElementById('recuperarEmail');
    if (botonEnviarPass && recuperarEmail) {
      botonEnviarPass.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = recuperarEmail.value.trim();
        if (email === '') {
          alert('Por favor, ingrese un correo electrónico');
          return;
        }
        try {
          const response = await fetch('http://localhost:3000/verificar-usuario', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
          });
          if (!response.ok) {
            console.error(`Error ${response.status}: ${response.statusText}`);
            alert('Error al verificar el usuario');
            return;
          }
          const data = await response.json();
          if (!data.existe) {
            alert('El correo electrónico no corresponde a un usuario registrado');
            return;
          }
          console.log('Correo electrónico verificado:', email);
          const responseEnviarCorreo = await fetch('http://localhost:3000/recuperar-contrasena', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
          });
          if (!responseEnviarCorreo.ok) {
            console.error(`Error ${responseEnviarCorreo.status}: ${responseEnviarCorreo.statusText}`);
            alert('Error al enviar el correo electrónico');
            return;
          }
          console.log('Correo electrónico enviado correctamente');
          alert('Correo electrónico enviado correctamente');
        } catch (error) {
          console.error('Error al verificar el usuario:', error);
          alert('Error de conexión');
        }
      });
    } else {
      console.error('No se encontró el elemento botonEnviarPass o recuperarEmail');
    }
  });