document.addEventListener('DOMContentLoaded', () => {
  // Primero chequeamos si hay alguien logueado
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser || !currentUser.isLoggedIn) {
    // Si no hay sesión, te mando al inicio
    window.location.href = '../index.html';
    return;
  }

  const esProfesional = currentUser.tipo === 'profesional';

  // Si no es profesional, oculta campos
  if (!esProfesional) {
    ['rubros-section', 'estado-section', 'descripcion-section', 'galeria-section', 'empresa-row'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
  }

  // Elementos comunes del perfil
  const nombreEl = document.getElementById('nombre');
  const emailEl = document.getElementById('email');
  const telefonoEl = document.getElementById('telefono');
  const direccionEl = document.getElementById('direccion');
  const empresaEl = document.getElementById('empresa');
  const editarBtn = document.getElementById('editar-datos');
  const guardarBtn = document.getElementById('guardar-datos');
  const cancelarBtn = document.getElementById('cancelar-datos');
  const cerrarSesionBtn = document.getElementById('cerrar-sesion');
  const avatarEl = document.getElementById('avatar');
  const cambiarAvatarBtn = document.getElementById('cambiar-avatar');
  const inputAvatar = document.getElementById('input-avatar');

  // Estado de edición y avatar
  let modoEdicion = false;
  let avatar = currentUser.avatar || '../assets/images/avatar-de-usuario.png';

  // datos del usuario
  document.getElementById('profesion').textContent = esProfesional ? (currentUser.rubroPrincipal || 'Profesional') : 'Mi perfil';
  nombreEl.textContent = `${currentUser.nombre} ${currentUser.apellido}`;
  emailEl.value = currentUser.email || '';
  telefonoEl.value = currentUser.telefono || '';
  direccionEl.value = currentUser.direccion || '';
  empresaEl.value = currentUser.empresa || '';
  avatarEl.src = avatar;

  // Si es profesional, muestra campos extras
  let descripcion = currentUser.descripcion || '';
  let estado = currentUser.estado !== false;
  let rubros = Array.isArray(currentUser.rubros) ? [...currentUser.rubros] : [];
  let imagenes = currentUser.imagenes || [];

  if (esProfesional) {
    // Referencias de profesional
    const estadoBtn = document.getElementById('toggle-estado');
    const descripcionTexto = document.getElementById('descripcion-texto');
    const listaRubros = document.getElementById('lista-rubros');
    const nuevoRubroSelect = document.getElementById('nuevo-rubro');
    const agregarRubroBtn = document.getElementById('agregar-rubro');
    const rubroNuevoContainer = document.getElementById('rubro-nuevo-container');
    const fileInput = document.getElementById('file-input');
    const agregarImagenBtn = document.getElementById('agregar-imagen');
    const imagenesContainer = document.getElementById('imagenes-container');

    // muestra info
    descripcionTexto.textContent = descripcion;
    estadoBtn.textContent = estado ? 'Disponible' : 'No disponible';
    estadoBtn.classList.toggle('inactivo', !estado);
    renderRubros();
    renderImagenes();
    rubroNuevoContainer.hidden = true;

    // Cara de oficios en el selector
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

    // Función: muestra rubros en la lista
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

    // Función: muestra imágenes del profesional
    function renderImagenes() {
      imagenesContainer.innerHTML = '';
      imagenes.forEach((src, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'imagen-wrapper';
        const img = document.createElement('img');
        img.src = src;
        const btn = document.createElement('button');
        btn.textContent = '✖';
        btn.onclick = () => eliminarImagen(index, src);
        wrapper.appendChild(img);
        wrapper.appendChild(btn);
        imagenesContainer.appendChild(wrapper);
      });
    }

    // Elimina imagen del servidor y actualiza local
    async function eliminarImagen(index, src) {
      try {
        const filename = src.split('/').pop();
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
        imagenes.splice(index, 1);
        await guardarPerfil({ ...currentUser, imagenes, avatar });
        renderImagenes();
      } catch (err) {
        console.error('Error al eliminar imagen:', err);
        alert('Error al eliminar imagen');
      }
    }

    // Botón para agregar nuevo rubro
    agregarRubroBtn.addEventListener('click', () => {
      const nuevo = nuevoRubroSelect.value.trim();
      if (nuevo && !rubros.includes(nuevo)) {
        rubros.push(nuevo);
        nuevoRubroSelect.value = '';
        renderRubros();
      }
    });

    // Botón para cambiar estado disponible/no disponible
    estadoBtn.addEventListener('click', () => {
      if (!modoEdicion) return;
      estado = !estado;
      estadoBtn.textContent = estado ? 'Disponible' : 'No disponible';
      estadoBtn.classList.toggle('inactivo', !estado);
    });

    // Botón para abrir selector de imagen
    agregarImagenBtn.addEventListener('click', () => fileInput.click());

    // Al subir imagen, la guarda en servidor
    fileInput.addEventListener('change', async () => {
      const archivo = fileInput.files[0];
      if (!archivo) return;
      const formData = new FormData();
      formData.append('imagen', archivo);
      try {
        const res = await fetch('http://localhost:3000/subirImagen', { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok || !data.filename) {
          alert('Error al subir imagen');
          return;
        }
        const url = `/assets/imagenesProfesionales/${data.filename}`;
        imagenes.push(url);
        if (!avatar || avatar.includes('default-avatar')) {
          avatar = url;
          avatarEl.src = avatar;
        }
        await guardarPerfil({ ...currentUser, imagenes, avatar });
        renderImagenes();
      } catch (err) {
        console.error('Error al subir imagen:', err);
        alert('Error al subir imagen');
      }
    });
  }

  // Botón para cambiar el avatar
  cambiarAvatarBtn.addEventListener('click', () => inputAvatar.click());
  inputAvatar.addEventListener('change', async () => {
    const archivo = inputAvatar.files[0];
    if (!archivo) return;
    const formData = new FormData();
    formData.append('imagen', archivo);
    try {
      const res = await fetch('http://localhost:3000/subirImagen', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok || !data.filename) {
        alert('Error al subir avatar');
        return;
      }
      avatar = `/assets/imagenesProfesionales/${data.filename}`;
      avatarEl.src = avatar;
      await guardarPerfil({ ...currentUser, avatar });
    } catch (err) {
      console.error('Error al subir avatar:', err);
      alert('Error al subir avatar');
    }
  });

  // Botón para empezar a editar
  editarBtn.addEventListener('click', () => {
    modoEdicion = true;
    [emailEl, telefonoEl, direccionEl, empresaEl].forEach(input => input.disabled = false);
    if (esProfesional) {
      document.getElementById('descripcion-texto').contentEditable = true;
      document.getElementById('rubro-nuevo-container').hidden = false;
    }
    editarBtn.hidden = true;
    guardarBtn.hidden = false;
    cancelarBtn.hidden = false;
    if (esProfesional) renderRubros();
  });

  // Cancelar recarga la página
  cancelarBtn.addEventListener('click', () => window.location.reload());

  // Botón guardar: manda cambios al servidor
  guardarBtn.addEventListener('click', async () => {
    modoEdicion = false;
    if (esProfesional) document.getElementById('rubro-nuevo-container').hidden = true;
    const actualizado = {
      ...currentUser,
      email: emailEl.value.trim(),
      telefono: telefonoEl.value.trim(),
      direccion: direccionEl.value.trim(),
      empresa: empresaEl.value.trim(),
      avatar
    };
    if (esProfesional) {
      actualizado.descripcion = document.getElementById('descripcion-texto').textContent.trim();
      actualizado.rubros = rubros;
      actualizado.imagenes = imagenes;
      actualizado.estado = estado;
    }
    try {
      await guardarPerfil(actualizado);
      window.location.reload();
    } catch {
    }
  });

  // Función para mandar datos al servidor y actualizar localStorage
async function guardarPerfil(actualizado) {
  try {
    actualizado.emailOriginal = currentUser.email;
    const res = await fetch('http://localhost:3000/actualizarPerfil', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(actualizado),
    });
    if (!res.ok) throw new Error('Error actualizando perfil');
    const data = await res.json();

    const userFinal = {
      ...currentUser, // conserva isLoggedIn, tipo, etc.
      ...data         // actualiza con lo que vino del servidor
    };

    localStorage.setItem('currentUser', JSON.stringify(userFinal));
    return userFinal;
  } catch (e) {
    console.error(e);
    alert('Error al guardar perfil');
    throw e;
  }
}

  // Botón para cerrar sesión
  cerrarSesionBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = '../index.html';
  });

  // Cargar trabajos (profesional o cliente)
  cargarTrabajos();

async function cargarTrabajos() {
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

    let trabajosFiltrados;
    if (esProfesional) {
      trabajosFiltrados = trabajos.filter(t => t.profesionalEmail === currentUser.email);
    } else {
      trabajosFiltrados = trabajos.filter(t => t.usuarioEmail === currentUser.email);
    }

    if (trabajosFiltrados.length === 0) {
      trabajosContainer.innerHTML = `<p class="cartelNoHay">No tenés trabajos ${
        esProfesional ? 'contratados' : 'realizados'
      } aún.</p>`;
      return;
    }

    trabajosContainer.innerHTML = '';
    trabajosFiltrados.forEach(trabajo => {
      const fecha = trabajo.fechaContratacion ? new Date(trabajo.fechaContratacion).toLocaleDateString('es-AR') : '';
      const comentario = trabajo.comentario?.trim() || 'Aún no se comentó';
      const valoracion = (trabajo.valoracion ?? '').toString().trim() || 'Aún no se valoró';

      const trabajoDiv = document.createElement('div');
      trabajoDiv.className = 'trabajo-item';

      // Contenido común
      let contenidoHTML = `
        <p><strong>${esProfesional ? 'Cliente' : 'Profesional'}:</strong> ${esProfesional ? (emailToNombre[trabajo.usuarioEmail] || trabajo.usuarioEmail) : (emailToNombre[trabajo.profesionalEmail] || trabajo.profesionalEmail)}</p>
        <p><strong>Rubro:</strong> ${trabajo.rubro}</p>
        <p><strong>Estado:</strong> <span class="estado-label">${trabajo.estado}</span></p>
        <p><strong>Fecha de contratación:</strong> ${fecha}</p>
      `;

      // Mostrar teléfonos
      if (esProfesional && trabajo.telefonoCliente) {
        contenidoHTML += `<p><strong>Teléfono del cliente:</strong> ${trabajo.telefonoCliente}</p>`;
      }
      if (!esProfesional && trabajo.telefonoProfesional) {
        contenidoHTML += `<p><strong>Teléfono del profesional:</strong> ${trabajo.telefonoProfesional}</p>`;
      }

      // Mostrar comentario y valoración si es profesional
      if (esProfesional) {
        contenidoHTML += `
          <p><strong>Comentario:</strong> ${comentario}</p>
          <p><strong>Valoración:</strong> ${valoracion}</p>
        `;
      }

        // Botones si el trabajo está pendiente
        if (trabajo.estado !== 'Finalizado' && trabajo.estado !== 'Cancelado') {
          if (esProfesional) {
            // Profesional puede finalizar/cancelar pero sin comentario ni valoración
            contenidoHTML += `
              <div class="botones-trabajo">
                <button class="finalizar-btn">✅ Finalizar</button>
                <button class="cancelar-btn">❌ Cancelar</button>
              </div>
            `;
          } else {
            // Cliente puede finalizar/cancelar y deja comentario y valoración
            contenidoHTML += `
              <div class="botones-trabajo">
                <button class="finalizar-btn">✅ Finalizar</button>
                <button class="cancelar-btn">❌ Cancelar</button>
              </div>
            `;
          }
        }

        trabajoDiv.innerHTML = contenidoHTML;
        trabajosContainer.appendChild(trabajoDiv);

        // Evento para botones
        if (trabajo.estado !== 'Finalizado' && trabajo.estado !== 'Cancelado') {
          const finalizarBtn = trabajoDiv.querySelector('.finalizar-btn');
          const cancelarBtn = trabajoDiv.querySelector('.cancelar-btn');

          if (esProfesional) {
            // Profesional: finaliza/cancela directo
            finalizarBtn.addEventListener('click', () => {
              actualizarEstadoTrabajo(trabajo.id, 'Finalizado');
            });
            cancelarBtn.addEventListener('click', () => {
              actualizarEstadoTrabajo(trabajo.id, 'Cancelado');
            });
          } else {
            // Cliente: pide comentario y valoración
            finalizarBtn.addEventListener('click', () => {
              Swal.fire({
                title: 'Finalizar trabajo',
                html: `
                  <textarea id="popup-comentario" class="swal2-textarea" placeholder="Dejá tu comentario"></textarea>
                  <input id="popup-valoracion" class="swal2-input" type="number" min="1" max="5" placeholder="Valoración (1-5)">
                `,
                showCancelButton: true,
                confirmButtonText: 'Guardar',
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                  const comentario = document.getElementById('popup-comentario').value.trim();
                  const valoracion = parseInt(document.getElementById('popup-valoracion').value.trim(), 10);
                  if (!comentario || isNaN(valoracion) || valoracion < 1 || valoracion > 5) {
                    Swal.showValidationMessage('Debés completar comentario y valoración entre 1 y 5.');
                    return false;
                  }
                  return { comentario, valoracion };
                }
              }).then((result) => {
                if (result.isConfirmed) {
                  const { comentario, valoracion } = result.value;
                  actualizarComentarioValoracion(trabajo.id, comentario, valoracion)
                    .then(() => actualizarEstadoTrabajo(trabajo.id, 'Finalizado'));
                }
              });
            });

            cancelarBtn.addEventListener('click', () => {
              Swal.fire({
                title: 'Cancelar trabajo',
                html: `
                  <textarea id="popup-cancelar-comentario" class="swal2-textarea" placeholder="¿Por qué cancelás el trabajo?"></textarea>
                `,
                showCancelButton: true,
                confirmButtonText: 'Guardar',
                cancelButtonText: 'Volver',
                preConfirm: () => {
                  const comentario = document.getElementById('popup-cancelar-comentario').value.trim();
                  if (!comentario) {
                    Swal.showValidationMessage('Debés ingresar un motivo.');
                    return false;
                  }
                  return comentario;
                }
              }).then((result) => {
                if (result.isConfirmed) {
                  const comentario = result.value;
                  actualizarComentarioValoracion(trabajo.id, comentario, null)
                    .then(() => actualizarEstadoTrabajo(trabajo.id, 'Cancelado'));
                }
              });
            });
          }
}

    });
  } catch (err) {
    console.error('Error cargando trabajos:', err);
    if (trabajosContainer) trabajosContainer.innerHTML = '<p class="cartelError">Error al cargar trabajos.</p>';
  }
}

// Función para actualizar estado (finalizado/cancelado)
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
    cargarTrabajos();
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

// Función para actualizar comentario y valoración
async function actualizarComentarioValoracion(id, comentario, valoracion) {
  try {
    const res = await fetch('http://localhost:3000/actualizarComentarioValoracion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, comentario, valoracion })
    });
    if (!res.ok) throw new Error('Error actualizando comentario/valoración');
    cargarTrabajos();
  } catch (err) {
    console.error('Error actualizando comentario y valoración:', err);
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo guardar comentario y valoración.',
      confirmButtonColor: '#dc3545'
    });
  }
}
});