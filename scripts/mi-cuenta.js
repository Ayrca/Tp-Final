document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser || currentUser.tipo !== 'profesional') {
    window.location.href = '../index.html';
    return;
  }

  // Elementos del DOM
  const nombreEl = document.getElementById('nombre');
  const telefonoEl = document.getElementById('telefono');
  const direccionEl = document.getElementById('direccion');
  const descripcionTexto = document.getElementById('descripcion-texto');
  const editarBtn = document.getElementById('editar-desc');
  const guardarBtn = document.getElementById('guardar-desc');
  const cancelarBtn = document.getElementById('cancelar-desc');
  const estadoBtn = document.getElementById('toggle-estado');
  const fileInput = document.getElementById('file-input');
  const agregarImagenBtn = document.getElementById('agregar-imagen');
  const imagenesContainer = document.getElementById('imagenes-container');

  // Datos
  let descripcion = currentUser.descripcion || '';
  let imagenes = currentUser.imagenes || [];
  let estado = currentUser.estado !== false;

  // Mostrar datos
  nombreEl.textContent = currentUser.nombre;
  telefonoEl.textContent = currentUser.telefono || 'No definido';
  direccionEl.textContent = currentUser.direccion || 'No definido';
  descripcionTexto.textContent = descripcion;
  estadoBtn.textContent = estado ? 'Activo' : 'Inactivo';
  estadoBtn.classList.toggle('inactivo', !estado);

  // Editar descripción
  editarBtn.addEventListener('click', () => {
    descripcionTexto.contentEditable = true;
    descripcionTexto.focus();
    editarBtn.hidden = true;
    guardarBtn.hidden = false;
    cancelarBtn.hidden = false;
  });

  guardarBtn.addEventListener('click', async () => {
    descripcionTexto.contentEditable = false;
    descripcion = descripcionTexto.textContent.trim();
    await guardarEnServidor();
    editarBtn.hidden = false;
    guardarBtn.hidden = true;
    cancelarBtn.hidden = true;
  });

  cancelarBtn.addEventListener('click', () => {
    descripcionTexto.contentEditable = false;
    descripcionTexto.textContent = descripcion;
    editarBtn.hidden = false;
    guardarBtn.hidden = true;
    cancelarBtn.hidden = true;
  });

  // Estado
  estadoBtn.addEventListener('click', async () => {
    estado = !estado;
    estadoBtn.textContent = estado ? 'Activo' : 'Inactivo';
    estadoBtn.classList.toggle('inactivo', !estado);
    await guardarEnServidor();
  });

  // Cargar imágenes
  function renderImagenes() {
    imagenesContainer.innerHTML = '';
    imagenes.forEach((src, index) => {
      const div = document.createElement('div');
      div.className = 'imagen-wrapper';

      const img = document.createElement('img');
      img.src = src;

      const x = document.createElement('button');
      x.textContent = '✖';
      x.className = 'eliminar-img';
      x.addEventListener('click', async () => {
        imagenes.splice(index, 1);
        await guardarEnServidor();
        renderImagenes();
      });

      div.appendChild(img);
      div.appendChild(x);
      imagenesContainer.appendChild(div);
    });
  }

  agregarImagenBtn.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', async () => {
    const archivo = fileInput.files[0];
    if (!archivo) return;

    const formData = new FormData();
    formData.append('imagen', archivo);

    try {
      const response = await fetch('http://localhost:3000/subirImagen', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok || !data.filename) {
        alert('Error al subir la imagen');
        return;
      }

      const url = `../assets/imagenesProfesionales/${data.filename}`;
      imagenes.push(url);
      await guardarEnServidor();
      renderImagenes();
    } catch (error) {
      console.error('Error al subir imagen:', error);
    }
  });

  // Guardar cambios en el servidor
  async function guardarEnServidor() {
    const actualizado = {
      email: currentUser.email,
      descripcion,
      imagenes,
      estado
    };

    try {
      const response = await fetch('http://localhost:3000/actualizarPerfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actualizado)
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || 'Error al actualizar perfil');
        return;
      }

      localStorage.setItem('currentUser', JSON.stringify(data));
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    }
  }

  renderImagenes();
});