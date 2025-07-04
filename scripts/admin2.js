document.addEventListener('DOMContentLoaded', () => {
  fetch('../datos/usuarios.json')
    .then(response => response.json())
    .then(usuarios => {
     let tipoUsuariosActual = null;
     
/*funcion para la tabla*/
function guardarCambios(fila, email) {
  const celdas = fila.children;
  const usuario = usuarios.find((u) => u.email === email);

  Swal.fire({
    title: '¿Estás seguro?',
    text: `¿Quieres guardar los cambios para el usuario ${usuario.nombre} ${usuario.apellido}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, guardar'
  }).then((result) => {
    if (result.isConfirmed) {
      // Código para guardar los cambios
      const indice = usuarios.findIndex(usuario => usuario.email === email);
      if (indice !== -1) {
        usuarios[indice].tipo = celdas[3].textContent;
        usuarios[indice].nombre = celdas[0].textContent.trim();
        usuarios[indice].apellido = celdas[1].textContent.trim();
        usuarios[indice].email = celdas[2].textContent;
        usuarios[indice].rubros = celdas[4].textContent.split(', ');
        usuarios[indice].empresa = celdas[5].textContent;
        usuarios[indice].telefono = celdas[6].textContent;
        usuarios[indice].direccion = celdas[7].textContent;
        usuarios[indice].estadoCuenta = celdas[8].textContent === 'Activo';

        fetch('/actualizarPerfil', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            emailOriginal: email,
            email: usuarios[indice].email,
            nombre: usuarios[indice].nombre,
            apellido: usuarios[indice].apellido,
            estadoCuenta: usuarios[indice].estadoCuenta,
            telefono: usuarios[indice].telefono,
            direccion: usuarios[indice].direccion,
            empresa: usuarios[indice].empresa,
            rubros: usuarios[indice].rubros,
          })
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }
        })
        .then(data => {
          // Actualizar la lista de usuarios
     
             cargarListaActual();
          Swal.fire({
            icon: "success",
            title: `Cambios guardados con éxito`,
            timer: 1500,
            showConfirmButton: false,
          });
        })
        .catch(error => console.error('Error:', error));
      }
    }
  });
}


function cargarListaActual() {
  if (tipoUsuariosActual === "Cliente" && usuarios.some(usuario => usuario.tipo.includes("Cliente"))) {
    const usuariosClientes = usuarios.filter(usuario => usuario.tipo.includes("Cliente"));
    cargarTablaUsuarios(usuariosClientes);
  } else if (tipoUsuariosActual === "profesional" && usuarios.some(usuario => usuario.tipo.includes("profesional"))) {
    const usuariosProfesionales = usuarios.filter(usuario => usuario.tipo.includes("profesional"));
    cargarTablaUsuarios(usuariosProfesionales);
  } else {
    cargarTablaUsuarios();
    tipoUsuariosActual = null;
  }
}


// funcion borrar para la tabla
function borrarUsuario(email) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: `¿Quieres borrar al usuario con email ${email}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, borrar'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch('/eliminarUsuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email
        })
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      })
      .then(data => {
        // Eliminar el usuario de la lista
        usuarios = usuarios.filter((usuario) => usuario.email !== email);
        // Actualizar la tabla
         
     //  cargarTablaUsuarios();
   cargarListaActual();
        Swal.fire({
          icon: "success",
          title: `Usuario borrado con éxito`,
          timer: 1500,
          showConfirmButton: false,
        });
      })
      .catch(error => console.error('Error:', error));
    }
  });
}





function bloquearUsuario(email) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Quieres bloquear al usuario?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, bloquear'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch('/actualizarEstadoCuenta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, estadoCuenta: false })
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      })
      .then(data => {

        // Actualizar el estado del usuario
        usuarios = usuarios.map((usuario) => {
          if (usuario.email === email) {
            usuario.estadoCuenta = false;
          }
          return usuario;
        });
        // Actualizar la tabla
        cargarListaActual();
       // cargarTablaUsuarios();
        Swal.fire({
          icon: "success",
          title: `Usuario bloqueado con éxito`,
          timer: 1500,
          showConfirmButton: false,
        });
      })
      .catch(error => console.error('Error:', error));
    }
  });
}

function desbloquearUsuario(email) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Quieres desbloquear al usuario?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, desbloquear'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch('/actualizarEstadoCuenta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, estadoCuenta: true })
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      })
      .then(data => {
        // Actualizar el estado del usuario
        usuarios = usuarios.map((usuario) => {
          if (usuario.email === email) {
            usuario.estadoCuenta = true;
          }
          return usuario;
        });
        // Actualizar la tabla
           cargarListaActual();
      //  cargarTablaUsuarios();
        Swal.fire({
          icon: "success",
          title: `Usuario desbloqueado con éxito`,
          timer: 1500,
          showConfirmButton: false,
        });
      })
      .catch(error => console.error('Error:', error));
    }
  });
}



//function cargarTablaUsuarios() {

function cargarTablaUsuarios(usuariosMostrar = usuarios) {
  const tbody = document.getElementById("tbody-usuarios");
  tbody.innerHTML = "";
  usuariosMostrar.forEach((usuario) => {

    const fila = document.createElement("tr");
    fila.setAttribute("data-email", usuario.email);
    fila.innerHTML = `
      <td contenteditable="true">${usuario.nombre}</td>
      <td contenteditable="true">${usuario.apellido}</td>
      <td contenteditable="true">${usuario.email}</td>
      <td contenteditable="true">${usuario.tipo}</td>
      <td contenteditable="true">${usuario.rubros.join(", ")}</td>
      <td contenteditable="true">${usuario.empresa}</td>
      <td contenteditable="true">${usuario.telefono}</td>
      <td contenteditable="true">${usuario.direccion}</td>
      <td>${usuario.estadoCuenta ? "Activo" : "Inactivo"}</td>
      <td>
        <button class="btn-guardar" data-email="${usuario.email}">Guardar</button>

${usuario.estadoCuenta ? 
          `<button class="btn-bloquear" data-email="${usuario.email}">Bloquear</button>` : 
          `<button class="btn-desbloquear" data-email="${usuario.email}">Desbloquear</button>`}
         <button class="btn-borrar" data-email="${usuario.email}">Borrar</button>
      </td>

    `;

    tbody.appendChild(fila);
  });
}

// Evento Modificar Usuario
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-guardar")) {
    const fila = e.target.closest("tr");
    const email = e.target.getAttribute("data-email");
    guardarCambios(fila, email);
  }
});

// Evento Borrar Usuario
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-borrar")) {
    const email = e.target.getAttribute("data-email");
    borrarUsuario(email);
  }
});

// Evento Bloquear Usuario
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-bloquear")) {
    const email = e.target.getAttribute("data-email");
    bloquearUsuario(email);
  } else if (e.target.classList.contains("btn-desbloquear")) {
    const email = e.target.getAttribute("data-email");
    desbloquearUsuario(email);
  }
});

// Evento desplegar Tabla
document.getElementById("traeLista").addEventListener("click", () => {
 cargarTablaUsuarios();
});


document.getElementById("traer-clientes").addEventListener("click", () => {
  tipoUsuariosActual = "Cliente";
  const usuariosClientes = usuarios.filter(usuario => usuario.tipo.includes("Cliente"));
  cargarTablaUsuarios(usuariosClientes);
});

document.getElementById("traer-profesionales").addEventListener("click", () => {
  tipoUsuariosActual = "profesional";
  const usuariosProfesionales = usuarios.filter(usuario => usuario.tipo.includes("profesional"));
  cargarTablaUsuarios(usuariosProfesionales);
});


  })
    .catch(error => console.error('Error:', error));
});