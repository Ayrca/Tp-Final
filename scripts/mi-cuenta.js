document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser || currentUser.tipo !== 'profesional') {
    window.location.href = '../index.html';
    return;
  }

  // Elementos
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
  const nuevoRubroInput = document.getElementById('nuevo-rubro');
  const agregarRubroBtn = document.getElementById('agregar-rubro');
  const rubroNuevoContainer = document.getElementById('rubro-nuevo-container');

  const fileInput = document.getElementById('file-input');
  const agregarImagenBtn = document.getElementById('agregar-imagen');
  const imagenesContainer = document.getElementById('imagenes-container');

  let descripcion = currentUser.descripcion || '';
  let imagenes = currentUser.imagenes || [];
  let estado = currentUser.estado !== false;
  let rubros = Array.isArray(currentUser.rubros) ? [...currentUser.rubros] : [];

  // Mostrar datos
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

  // Rubros
  function renderRubros() {
    listaRubros.innerHTML = '';
    rubros.forEach((rubro, index) => {
      const li = document.createElement('li');
      li.textContent = rubro;
      const btn = document.createElement('button');
      btn.textContent = '❌';
      btn.onclick = () => {
        rubros.splice(index, 1);
        renderRubros();
      };
      li.appendChild(btn);
      listaRubros.appendChild(li);
    });
  }

  agregarRubroBtn.addEventListener('click', () => {
    const nuevo = nuevoRubroInput.value.trim();
    if (nuevo && !rubros.includes(nuevo)) {
      rubros.push(nuevo);
      nuevoRubroInput.value = '';
      renderRubros();
    }
  });

  // Estado
  estadoBtn.addEventListener('click', () => {
    estado = !estado;
    estadoBtn.textContent = estado ? 'Activo' : 'Inactivo';
    estadoBtn.classList.toggle('inactivo', !estado);
  });

  // Botón editar
  editarBtn.addEventListener('click', () => {
    [emailEl, telefonoEl, direccionEl, empresaEl].forEach(input => input.disabled = false);
    descripcionTexto.contentEditable = true;
    rubroNuevoContainer.hidden = false;
    editarBtn.hidden = true;
    guardarBtn.hidden = false;
    cancelarBtn.hidden = false;
  });

  // Botón cancelar
  cancelarBtn.addEventListener('click', () => {
    window.location.reload();
  });

  // Botón guardar
  guardarBtn.addEventListener('click', async () => {
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
      const res = await fetch('http://localhost:3000/actualizarPerfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actualizado)
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Error al actualizar');
        return;
      }

      localStorage.setItem('currentUser', JSON.stringify(data));
      window.location.reload();
    } catch (err) {
      console.error('Error al guardar:', err);
    }
  });

  // Imágenes
  function renderImagenes() {
    imagenesContainer.innerHTML = '';
    imagenes.forEach((src, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'imagen-wrapper';
      const img = document.createElement('img');
      img.src = src;
      const btn = document.createElement('button');
      btn.textContent = '✖';
      btn.onclick = () => {
        imagenes.splice(index, 1);
        renderImagenes();
      };
      wrapper.appendChild(img);
      wrapper.appendChild(btn);
      imagenesContainer.appendChild(wrapper);
    });
  }

  agregarImagenBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', async () => {
    const archivo = fileInput.files[0];
    if (!archivo) return;

    const formData = new FormData();
    formData.append('imagen', archivo);

    try {
      const res = await fetch('http://localhost:3000/subirImagen', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok || !data.filename) {
        alert('Error al subir imagen');
        return;
      }

      const url = `../assets/imagenesProfesionales/${data.filename}`;
      imagenes.push(url);
      renderImagenes();
    } catch (err) {
      console.error('Error al subir imagen:', err);
    }
  });
});