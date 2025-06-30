document.addEventListener('DOMContentLoaded', () => {
  // Obtener usuario actual y validar tipo
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser || currentUser.tipo !== 'profesional') {
    window.location.href = '../index.html';
    return;
  }

  // Referencias a elementos DOM
  const nombreEl = document.getElementById('nombre');
  const emailEl = document.getElementById('email');
  const telefonoEl = document.getElementById('telefono');
  const direccionEl = document.getElementById('direccion');
  const empresaEl = document.getElementById('empresa');
  const descripcionTexto = document.getElementById('descripcion-texto');
  const estadoBtn = document.getElementById('toggle-estado');

  const editarBtn = document.getElementById('editar-datos');
  const guardarBtn = document.getElementById('guardar-datos');
  const cancelarBtn = document.getElementById('cancelar-datos');

  const listaRubros = document.getElementById('lista-rubros');
  const nuevoRubroSelect = document.getElementById('nuevo-rubro');
  const agregarRubroBtn = document.getElementById('agregar-rubro');
  const rubroNuevoContainer = document.getElementById('rubro-nuevo-container');

  const fileInput = document.getElementById('file-input');
  const agregarImagenBtn = document.getElementById('agregar-imagen');
  const imagenesContainer = document.getElementById('imagenes-container');

  // NUEVAS referencias para avatar
  const avatarEl = document.getElementById('avatar');
  const cambiarAvatarBtn = document.getElementById('cambiar-avatar');
  const inputAvatar = document.getElementById('input-avatar');

  // Variables con datos actuales del usuario
  let descripcion = currentUser.descripcion || '';
  let imagenes = currentUser.imagenes || [];
  let estado = currentUser.estado !== false;
  let rubros = Array.isArray(currentUser.rubros) ? [...currentUser.rubros] : [];
  let avatar = currentUser.avatar || '../assets/images/avatar-de-usuario.png';
  let modoEdicion = false;

  // Mostrar datos en pantalla
  nombreEl.textContent = `${currentUser.nombre} ${currentUser.apellido}`;
  emailEl.value = currentUser.email || '';
  telefonoEl.value = currentUser.telefono || '';
  direccionEl.value = currentUser.direccion || '';
  empresaEl.value = currentUser.empresa || '';
  descripcionTexto.textContent = descripcion;
  estadoBtn.textContent = estado ? 'Activo' : 'Inactivo';
  estadoBtn.classList.toggle('inactivo', !estado);
  avatarEl.src = avatar;
  renderRubros();
  renderImagenes();
  rubroNuevoContainer.hidden = true;

  // Cargar rubros disponibles
  fetch('http://localhost:3000/datos/oficios')
    .then(res => res.json())
    .then(oficios => {
      oficios.forEach(oficio => {
        const option = document.createElement('option');
        option.value = oficio.nombre;
        option.textContent = oficio.nombre;
        nuevoRubroSelect.appendChild(option);
      });
    })
    .catch(err => console.error('Error cargando oficios:', err));

  // Función para renderizar rubros
  function renderRubros() {
    listaRubros.innerHTML = '';
    rubros.forEach((rubro, index) => {
      const li = document.createElement('li');
      li.textContent = rubro;
      if (modoEdicion) {
        const btn = document.createElement('button');
        btn.textContent = '❌';
        btn.onclick = () => {
          rubros.splice(index, 1);
          renderRubros();
        };
        li.appendChild(btn);
      }
      listaRubros.appendChild(li);
    });
  }

  // Renderizar imágenes
  function renderImagenes() {
    imagenesContainer.innerHTML = '';
    imagenes.forEach((src, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'imagen-wrapper';
      const img = document.createElement('img');
      img.src = src;

      const btn = document.createElement('button');
      btn.textContent = '✖';
      btn.onclick = async () => {
        const filename = src.split('/').pop();

        try {
          // Eliminar imagen física en servidor
          const resEliminar = await fetch('http://localhost:3000/eliminarImagen', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename }),
          });
          const dataEliminar = await resEliminar.json();
          if (!resEliminar.ok || !dataEliminar.success) {
            alert('No se pudo eliminar la imagen del servidor');
            return;
          }

          // Actualizar array local y enviar cambios al backend
          imagenes.splice(index, 1);
          const actualizado = { ...currentUser, imagenes, avatar };
          const usuarioActualizado = await guardarPerfil(actualizado);

          // Actualizar localStorage y re-renderizar imágenes
          imagenes = usuarioActualizado.imagenes || [];
          renderImagenes();

        } catch (err) {
          console.error('Error al eliminar imagen:', err);
          alert('Error al eliminar imagen');
        }
      };

      wrapper.appendChild(img);
      wrapper.appendChild(btn);
      imagenesContainer.appendChild(wrapper);
    });
  }

  // Agregar rubro desde select
  agregarRubroBtn.addEventListener('click', () => {
    const nuevo = nuevoRubroSelect.value.trim();
    if (nuevo && !rubros.includes(nuevo)) {
      rubros.push(nuevo);
      nuevoRubroSelect.value = '';
      renderRubros();
    }
  });

  // Cambiar estado activo/inactivo
  estadoBtn.addEventListener('click', () => {
    estado = !estado;
    estadoBtn.textContent = estado ? 'Activo' : 'Inactivo';
    estadoBtn.classList.toggle('inactivo', !estado);
  });

  // Habilitar edición
  editarBtn.addEventListener('click', () => {
    modoEdicion = true;
    [emailEl, telefonoEl, direccionEl, empresaEl].forEach(input => input.disabled = false);
    descripcionTexto.contentEditable = true;
    rubroNuevoContainer.hidden = false;
    editarBtn.hidden = true;
    guardarBtn.hidden = false;
    cancelarBtn.hidden = false;
    renderRubros();
  });

  // Cancelar edición recargando la página
  cancelarBtn.addEventListener('click', () => {
    modoEdicion = false;
    rubroNuevoContainer.hidden = true;
    window.location.reload();
  });

  // Función para guardar perfil en backend y actualizar localStorage
  async function guardarPerfil(actualizado) {
    try {
      actualizado.emailOriginal = currentUser.email; // clave para backend
      const res = await fetch('http://localhost:3000/actualizarPerfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actualizado),
      });
      if (!res.ok) throw new Error('Error actualizando perfil');
      const data = await res.json();
      localStorage.setItem('currentUser', JSON.stringify(data));
      return data;
    } catch (e) {
      console.error(e);
      alert('Error al guardar perfil');
      throw e;
    }
  }

  // Guardar cambios al hacer click en guardar
  guardarBtn.addEventListener('click', async () => {
    modoEdicion = false;
    rubroNuevoContainer.hidden = true;

    const actualizado = {
      ...currentUser,
      email: emailEl.value.trim(),
      telefono: telefonoEl.value.trim(),
      direccion: direccionEl.value.trim(),
      empresa: empresaEl.value.trim(),
      descripcion: descripcionTexto.textContent.trim(),
      rubros,
      imagenes,
      estado,
      avatar
    };

    try {
      const usuarioActualizado = await guardarPerfil(actualizado);
      // Actualizar variables locales
      imagenes = usuarioActualizado.imagenes || [];
      rubros = usuarioActualizado.rubros || [];
      descripcion = usuarioActualizado.descripcion || '';
      estado = usuarioActualizado.estado;
      avatar = usuarioActualizado.avatar || avatar;

      emailEl.disabled = true;
      telefonoEl.disabled = true;
      direccionEl.disabled = true;
      empresaEl.disabled = true;
      descripcionTexto.contentEditable = false;
      editarBtn.hidden = false;
      guardarBtn.hidden = true;
      cancelarBtn.hidden = true;
      renderRubros();
      renderImagenes();
      avatarEl.src = avatar;
    } catch {
      // error ya manejado en guardarPerfil
    }
  });

  // Abrir selector de archivo al click en botón para agregar imagenes de trabajos
  agregarImagenBtn.addEventListener('click', () => fileInput.click());

  // Subir imagen seleccionada de trabajos anteriores
  fileInput.addEventListener('change', async () => {
    const archivo = fileInput.files[0];
    if (!archivo) return;

    const formData = new FormData();
    formData.append('imagen', archivo);

    try {
      const res = await fetch('http://localhost:3000/subirImagen', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.filename) {
        alert('Error al subir imagen');
        return;
      }

      // Usar ruta absoluta para evitar problemas con recarga
      const url = `/assets/imagenesProfesionales/${data.filename}`;
      imagenes.push(url);

      // Si no hay avatar o es default, asignar esta nueva imagen como avatar
      if (!avatar || avatar.includes('default-avatar')) {
        avatar = url;
        avatarEl.src = avatar;
      }

      // Guardar el perfil actualizado con nuevo array e avatar
      const actualizado = { ...currentUser, imagenes, avatar };
      const usuarioActualizado = await guardarPerfil(actualizado);

      imagenes = usuarioActualizado.imagenes || [];
      avatar = usuarioActualizado.avatar || avatar;
      renderImagenes();
    } catch (err) {
      console.error('Error al subir imagen:', err);
      alert('Error al subir imagen');
    }
  });

  //cambiar avatar
  cambiarAvatarBtn.addEventListener('click', () => {
    inputAvatar.click();
  });

  inputAvatar.addEventListener('change', async () => {
    const archivo = inputAvatar.files[0];
    if (!archivo) return;

    const formData = new FormData();
    formData.append('imagen', archivo);

    try {
      const res = await fetch('http://localhost:3000/subirImagen', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.filename) {
        alert('Error al subir avatar');
        return;
      }

      const url = `/assets/imagenesProfesionales/${data.filename}`;

      // Actualizar avatar localmente
      avatar = url;
      avatarEl.src = avatar;

      // Guardar avatar actualizado en perfil
      const actualizado = { ...currentUser, avatar };
      const usuarioActualizado = await guardarPerfil(actualizado);

      avatar = usuarioActualizado.avatar || avatar;
      avatarEl.src = avatar;

    } catch (err) {
      console.error('Error al subir avatar:', err);
      alert('Error al subir avatar');
    }
  });

async function cargarTrabajosDelProfesional() {
  const trabajosContainer = document.getElementById('trabajos-container');
  if (!trabajosContainer) return;

  try {
    const [trabajosRes, usuariosRes] = await Promise.all([
      fetch('../datos/trabajos.json'),
      fetch('../datos/usuarios.json')
    ]);

    const trabajos = await trabajosRes.json();
    const usuarios = await usuariosRes.json();

    const emailToNombre = {};
    usuarios.forEach(u => {
      emailToNombre[u.email] = `${u.nombre} ${u.apellido}`;
    });

    //Filtrar trabajos del profesional actual
    const trabajosDelProfesional = trabajos.filter(
      t => t.profesionalEmail === currentUser.email
    );

    if (trabajosDelProfesional.length === 0) {
      trabajosContainer.innerHTML = '<p class="cartelNoHay">No tenés trabajos contratados aún.</p>';
      return;
    }

// Renderizar trabajos
trabajosContainer.innerHTML = '';
trabajosDelProfesional.forEach(trabajo => {
  let fecha = '';
  if (trabajo.fechaContratacion) {
    const fechaObj = new Date(trabajo.fechaContratacion);
    const dia = fechaObj.getDate();
    const mes = fechaObj.getMonth() + 1;
    const anio = fechaObj.getFullYear();
    fecha = `${dia}/${mes}/${anio}`;
  }

  const comentario = (trabajo.comentario ?? '').trim() !== '' ? trabajo.comentario : 'Aún no se comentó';
  const valoracion = (trabajo.valoracion ?? '').toString().trim() !== '' && trabajo.valoracion !== null
    ? trabajo.valoracion
    : 'Aún no se valoró';

  // Crear elemento del trabajo
  const trabajoDiv = document.createElement('div');
  trabajoDiv.className = 'trabajo-item';
  trabajoDiv.innerHTML = `
    <p><strong>Cliente:</strong> ${emailToNombre[trabajo.usuarioEmail] || trabajo.usuarioEmail}</p>
    <p><strong>Rubro:</strong> ${trabajo.rubro}</p>
    <p><strong>Estado:</strong> <span class="estado-label">${trabajo.estado}</span></p>
    <p><strong>Fecha de contratación:</strong> ${fecha}</p>
    <p><strong>Comentario:</strong> ${comentario}</p>
    <p><strong>Valoración:</strong> ${valoracion}</p>
    <div class="botones-trabajo">
      <button class="finalizar-btn">✅ Finalizar</button>
      <button class="cancelar-btn">❌ Cancelar</button>
    </div>
  `;

  // Deshabilitar botones si ya está finalizado o cancelado
  if (trabajo.estado === 'Finalizado' || trabajo.estado === 'Cancelado') {
    trabajoDiv.querySelector('.finalizar-btn').disabled = true;
    trabajoDiv.querySelector('.cancelar-btn').disabled = true;
  } else {
    // Eventos para los botones
    trabajoDiv.querySelector('.finalizar-btn').addEventListener('click', () => actualizarEstadoTrabajo(trabajo.id, 'Finalizado'));
    trabajoDiv.querySelector('.cancelar-btn').addEventListener('click', () => actualizarEstadoTrabajo(trabajo.id, 'Cancelado'));
  }

  trabajosContainer.appendChild(trabajoDiv);
});

  } catch (err) {
    console.error('Error cargando trabajos del profesional:', err);
    trabajosContainer.innerHTML = '<p class="cartelError">Error al cargar trabajos.</p>';
  }
}

//funcion para actualizar estado de trabajo: de pendiente a finalizado o cancelado
async function actualizarEstadoTrabajo(id, nuevoEstado) {
  try {
    const res = await fetch('http://localhost:3000/actualizarEstadoTrabajo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, estado: nuevoEstado })
    });

    if (!res.ok) throw new Error('Error actualizando estado');

    await Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: `Trabajo marcado como ${nuevoEstado}.`,
      confirmButtonColor: '#28a745'
    });

    // Volver a cargar trabajos
    cargarTrabajosDelProfesional();

  } catch (err) {
    console.error('Error actualizando estado del trabajo:', err);
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo actualizar el estado del trabajo.',
      confirmButtonColor: '#dc3545'
    });
  }
}

document.getElementById('cerrar-sesion').addEventListener('click', () => {
  localStorage.removeItem('currentUser');  // Borra la sesión local
  window.location.href = '../index.html';  // Redirige al home o login
});

  renderImagenes();
  cargarTrabajosDelProfesional();
});