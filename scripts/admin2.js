document.addEventListener('DOMContentLoaded', () => {
  fetch('../datos/usuarios.json')
    .then(response => response.json())
    .then(usuarios => {
      // Función para traer los tipos de usuarios
      function traerTiposUsuarios() {
        const tiposUsuarios = [...new Set(usuarios.map(usuario => usuario.tipo))];
        const selectTiposUsuarios = document.getElementById("input-listaArray");
        tiposUsuarios.forEach(tipo => {
          const option = document.createElement("option");
          option.text = tipo;
          option.value = tipo;
          selectTiposUsuarios.appendChild(option);
        });
      }

      // Función para traer los usuarios según el tipo seleccionado
      function traerUsuariosPorTipo() {
        const selectTiposUsuarios = document.getElementById("input-listaArray");
        const tipoSeleccionado = selectTiposUsuarios.value;
        const usuariosPorTipo = usuarios.filter(usuario => usuario.tipo === tipoSeleccionado);
        const selectUsuarios = document.getElementById("input-lista");
        selectUsuarios.innerHTML = "";
        usuariosPorTipo.forEach(usuario => {
          const option = document.createElement("option");
          option.text = `${usuario.nombre} ${usuario.apellido}`;
          option.value = JSON.stringify(usuario);
          selectUsuarios.appendChild(option);
        });
      }

      // Función para cargar los datos del usuario seleccionado en los inputs
      function cargarDatosUsuario() {
        const selectUsuarios = document.getElementById("input-lista");
        const usuarioSeleccionado = JSON.parse(selectUsuarios.value);
        document.getElementById("input-Tipo").value = usuarioSeleccionado.tipo;
        document.getElementById("input-Nombre").value = usuarioSeleccionado.nombre;
        document.getElementById("input-Apellido").value = usuarioSeleccionado.apellido;
        document.getElementById("input-Email").value = usuarioSeleccionado.email;
        document.getElementById("input-Rubros").value = usuarioSeleccionado.rubros.join(', ');
        document.getElementById("input-Empresa").value = usuarioSeleccionado.empresa;
        document.getElementById("input-Telefono").value = usuarioSeleccionado.telefono;
        document.getElementById("input-Direccion").value = usuarioSeleccionado.direccion;
        document.getElementById("input-EstadoCuenta").value = usuarioSeleccionado.estadoCuenta;
      }

function limpiarLista() {
  const inputs = [
    "input-Tipo",
    "input-Nombre",
    "input-Apellido",
    "input-Email",
    "input-Rubros",
    "input-Empresa",
    "input-Telefono",
    "input-Direccion",
    "input-EstadoCuenta"
  ];

  const selects = [
    "input-listaArray",
    "input-lista"
  ];

  inputs.forEach(id => {
    document.getElementById(id).value = "";
  });

  selects.forEach(id => {
    document.getElementById(id).innerHTML = "";
  });
}

function guardarCambios() {
  const usuarioSeleccionado = JSON.parse(document.getElementById("input-lista").value);
  Swal.fire({
    title: '¿Estás seguro?',
    text: `¿Quieres guardar los cambios para el usuario ${usuarioSeleccionado.nombre} ${usuarioSeleccionado.apellido}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, guardar'
  }).then((result) => {
    if (result.isConfirmed) {
      // Código para guardar los cambios
      const indice = usuarios.findIndex(usuario => usuario.email === usuarioSeleccionado.email);
      if (indice !== -1) {
        usuarios[indice].tipo = document.getElementById("input-Tipo").value;
        usuarios[indice].nombre = document.getElementById("input-Nombre").value.trim();
        usuarios[indice].apellido = document.getElementById("input-Apellido").value.trim();
        usuarios[indice].email = document.getElementById("input-Email").value;
        usuarios[indice].rubros = document.getElementById("input-Rubros").value.split(', ');
        usuarios[indice].empresa = document.getElementById("input-Empresa").value;
        usuarios[indice].telefono = document.getElementById("input-Telefono").value;
        usuarios[indice].direccion = document.getElementById("input-Direccion").value;
        usuarios[indice].estadoCuenta = document.getElementById("input-EstadoCuenta").value === 'true';
      }
      fetch('/actualizarPerfil', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          emailOriginal: usuarioSeleccionado.email,
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
        traerUsuariosPorTipo();
        Swal.fire({
          icon: "success",
          title: `Cambios guardados con éxito`,
          timer: 1500,
          showConfirmButton: false,
        });
      })
      .catch(error => console.error('Error:', error));
    }
  });
}

function actualizarListaUsuarios() {
  const usuarioSeleccionado = JSON.parse(document.getElementById("input-lista").value);
  const tipo = usuarioSeleccionado.tipo;
  const selectUsuarios = document.getElementById("input-lista");
  selectUsuarios.innerHTML = "";
  usuarios.forEach(usuario => {
    if (usuario.tipo === tipo) {
      const option = document.createElement("option");
      option.text = `${usuario.nombre} ${usuario.apellido}`;
      option.value = JSON.stringify(usuario);
      if (usuario.email === usuarioSeleccionado.email) {
        option.selected = true;
        document.getElementById("input-Nombre").value = usuario.nombre;
        document.getElementById("input-Apellido").value = usuario.apellido;
        document.getElementById("input-Email").value = usuario.email;
        document.getElementById("input-Rubros").value = usuario.rubros;
        document.getElementById("input-Empresa").value = usuario.empresa;
        document.getElementById("input-Telefono").value = usuario.telefono;
        document.getElementById("input-Direccion").value = usuario.direccion;
        document.getElementById("input-EstadoCuenta").value = usuario.estadoCuenta;

      }
      selectUsuarios.appendChild(option);
    }
  });
}

function actualizarListaUsuariosDespuesDeBorrar(tipoActual) {
  const selectUsuarios = document.getElementById("input-lista");
  selectUsuarios.innerHTML = "";
  usuarios.forEach(usuario => {
    if (usuario.tipo === tipoActual) {
      const option = document.createElement("option");
      option.text = `${usuario.nombre} ${usuario.apellido}`;
      option.value = JSON.stringify(usuario);
      selectUsuarios.appendChild(option);
    }
  });
  if (usuarios.filter(usuario => usuario.tipo === tipoActual).length > 0) {
    const primerUsuario = usuarios.find(usuario => usuario.tipo === tipoActual);
    document.getElementById("input-Nombre").value = primerUsuario.nombre;
    document.getElementById("input-Apellido").value = primerUsuario.apellido;
    document.getElementById("input-Email").value = primerUsuario.email;
    selectUsuarios.value = JSON.stringify(primerUsuario); // Seleccionar el primer usuario
  } else {
    document.getElementById("input-Nombre").value = "";
    document.getElementById("input-Apellido").value = "";
    document.getElementById("input-Email").value = "";
  }
}

/// Botón Borrar Usuario
document.getElementById("borrarDato").addEventListener("click", () => {
  const usuarioSeleccionado = JSON.parse(document.getElementById("input-lista").value);
  const tipoActual = usuarioSeleccionado.tipo; // Guardar el tipo actual
  Swal.fire({
    title: '¿Estás seguro?',
    text: `¿Quieres borrar al usuario ${usuarioSeleccionado.nombre} ${usuarioSeleccionado.apellido}?`,
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
        body: JSON.stringify({ email: usuarioSeleccionado.email })
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      })
      .then(data => {
        const indice = usuarios.findIndex(usuario => usuario.email === usuarioSeleccionado.email);
        if (indice !== -1) {
          usuarios.splice(indice, 1);
        }
        actualizarListaUsuariosDespuesDeBorrar(tipoActual);
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
});

// Botón Bloquear Usuario
document.getElementById("bloquearUsuario").addEventListener("click", () => {
  const usuarioSeleccionado = JSON.parse(document.getElementById("input-lista").value);
  Swal.fire({
    title: '¿Estás seguro?',
    text: `¿Quieres bloquear al usuario ${usuarioSeleccionado.nombre} ${usuarioSeleccionado.apellido}?`,
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
        body: JSON.stringify({ email: usuarioSeleccionado.email, estadoCuenta: false })
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      })
      .then(data => {
        const indice = usuarios.findIndex(usuario => usuario.email === usuarioSeleccionado.email);
        if (indice !== -1) {
          usuarios[indice].estadoCuenta = false;
        }
        actualizarListaUsuarios();
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
});

// Botón Desbloquear Usuario
document.getElementById("desbloquearUsuario").addEventListener("click", () => {
  const usuarioSeleccionado = JSON.parse(document.getElementById("input-lista").value);
  Swal.fire({
    title: '¿Estás seguro?',
    text: `¿Quieres desbloquear al usuario ${usuarioSeleccionado.nombre} ${usuarioSeleccionado.apellido}?`,
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
        body: JSON.stringify({ email: usuarioSeleccionado.email, estadoCuenta: true })
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      })
      .then(data => {
        const indice = usuarios.findIndex(usuario => usuario.email === usuarioSeleccionado.email);
        if (indice !== -1) {
          usuarios[indice].estadoCuenta = true;
        }
        actualizarListaUsuarios();
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
});

  document.getElementById("traeLista").addEventListener("click", () => {
  limpiarLista();
  traerTiposUsuarios();
  });

  document.getElementById("modificarDato").addEventListener("click",guardarCambios);
  document.getElementById("limpiarLista").addEventListener("click", limpiarLista);
  document.getElementById("input-listaArray").addEventListener("change", traerUsuariosPorTipo);
  document.getElementById("input-lista").addEventListener("change", cargarDatosUsuario);
      
    })
    .catch(error => console.error('Error:', error));
});