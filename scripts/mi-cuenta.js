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
  const estadoBtn = document.getElementById('estado-toggle');
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

  guardarBtn.addEventListener('click', () => {
    descripcionTexto.contentEditable = false;
    descripcion = descripcionTexto.textContent.trim();
    guardarEnLocal();
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
  estadoBtn.addEventListener('click', () => {
    estado = !estado;
    estadoBtn.textContent = estado ? 'Activo' : 'Inactivo';
    estadoBtn.classList.toggle('inactivo', !estado);
    guardarEnLocal();
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
      x.addEventListener('click', () => {
        imagenes.splice(index, 1);
        guardarEnLocal();
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

  fileInput.addEventListener('change', () => {
    const archivo = fileInput.files[0];
    if (archivo) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagenes.push(e.target.result);
        guardarEnLocal();
        renderImagenes();
      };
      reader.readAsDataURL(archivo);
    }
  });

  function guardarEnLocal() {
    const actualizado = {
      ...currentUser,
      descripcion,
      imagenes,
      estado
    };
    localStorage.setItem('currentUser', JSON.stringify(actualizado));
  }

  renderImagenes();
});