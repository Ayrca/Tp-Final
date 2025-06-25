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

  // Variables con datos actuales del usuario
  let descripcion = currentUser.descripcion || '';
  let imagenes = currentUser.imagenes || [];
  let estado = currentUser.estado !== false;
  let rubros = Array.isArray(currentUser.rubros) ? [...currentUser.rubros] : [];
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
      estado
    };

    try {
      const usuarioActualizado = await guardarPerfil(actualizado);
      // Actualizar variables locales
      imagenes = usuarioActualizado.imagenes || [];
      rubros = usuarioActualizado.rubros || [];
      descripcion = usuarioActualizado.descripcion || '';
      estado = usuarioActualizado.estado;
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
    } catch {
      // error ya manejado en guardarPerfil
    }
  });

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
          const actualizado = { ...currentUser, imagenes };
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

  // Abrir selector de archivo al click en botón
  agregarImagenBtn.addEventListener('click', () => fileInput.click());

  // Subir imagen seleccionada
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

      // Guardar el perfil actualizado con nuevo array
      const actualizado = { ...currentUser, imagenes };
      const usuarioActualizado = await guardarPerfil(actualizado);

      imagenes = usuarioActualizado.imagenes || [];
      renderImagenes();
    } catch (err) {
      console.error('Error al subir imagen:', err);
      alert('Error al subir imagen');
    }
  });

  // Renderizar imágenes inicial
  renderImagenes();

});