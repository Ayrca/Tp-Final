const inputNombre = document.getElementById('input-Nombre');
const inputPagina = document.getElementById('input-pagina');
const inputImagen = document.getElementById('input-Imagen');
const inputImagen1 = document.getElementById('imagen');
const botonSubir = document.getElementById('subir-imagen');

async function obtenerPublicidad() {
  try {
    const response = await fetch('../datos/publicidad.json');
    const publicidad = await response.json();
    return publicidad;
  } catch (error) {
    console.error('Error al obtener la publicidad:', error);
  }
}

async function agregarPublicidad(nombreArray, objeto) {
  console.log('Nombre del array:', nombreArray);
  try {
    const response = await fetch(`/publicidad/${nombreArray}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(objeto)
    });
    const resultado = await response.json();
    if (resultado.error) {
      console.error('Error agregando publicidad:', resultado.error);
    } else {
      console.log('Publicidad agregada con éxito');
    }
  } catch (error) {
    console.error('Error agregando publicidad:', error);
  }
}

async function eliminarPublicidad(id, arrayName) {
  try {
    const response = await fetch(`/publicidad/${arrayName}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Publicidad no encontrada');
    }
    const resultado = await response.json();
    console.log(resultado);
  } catch (error) {
    console.error('Error al eliminar la publicidad:', error);
  }
}

async function actualizarPublicidad(id, arrayName, publicidad) {
  try {
    const response = await fetch(`http://localhost:3000/publicidad/${arrayName}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(publicidad)
    });
    if (!response.ok) {
      throw new Error('Publicidad no encontrada');
    }
    const data = await response.json();
    console.log('Respuesta de la actualización:', data); // Agrega este console.log
  } catch (error) {
    console.error(error);
  }
}

let selectedArray = null;
let respuesta = null;

async function mostrarTabla() {
  if (!respuesta) {
    respuesta = await obtenerPublicidad();
  }  
  const tablaArrays = document.getElementById('tabla-arrays');
  tablaArrays.innerHTML = '';
  Object.keys(respuesta).forEach((key) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td><input type="radio" name="array" value="${key}">${key}</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    `;
    tablaArrays.appendChild(fila);
    const radio = fila.querySelector('input[type="radio"]');
    radio.addEventListener('change', () => {
      selectedArray = radio.value;
      mostrarDatosTabla();

      // Mostrar la imagen del primer objeto del array seleccionado
      const objeto = respuesta[selectedArray][0];
      const imagenSeleccionada = document.getElementById('imagen-seleccionada');
      imagenSeleccionada.src = objeto.imagen;


    });
  });
}

async function mostrarDatosTabla() {

  if (!respuesta) {
    respuesta = await obtenerPublicidad();
  }
  const radios = document.getElementsByName('array');
  let seleccionado = false;
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      seleccionado = true;
      break;
    }
  }

  if (!seleccionado) {
    const imagenSeleccionada = document.getElementById('imagen-seleccionada');
    imagenSeleccionada.src = '';
  } else {
    // Mostrar la imagen del primer objeto del array seleccionado
    const objeto = respuesta[selectedArray][0];
    const imagenSeleccionada = document.getElementById('imagen-seleccionada');
    imagenSeleccionada.src = objeto.imagen;
  }

    console.log('Valor de respuesta:', respuesta); // Agrega este console.log
  const tablaDatos = document.getElementById('tabla-datos');
  tablaDatos.innerHTML = '';
  respuesta[selectedArray].forEach((objeto) => {
    const nuevaFila = document.createElement('tr');
    nuevaFila.innerHTML = `
      <td></td>
      <td><input type="text" value="${objeto.nombre}" id="nombre-${objeto.id}"></td>
      <td><input type="text" value="${objeto.imagen}" id="imagen-${objeto.id}"></td>
      <td><input type="text" value="${objeto.pagina}" id="pagina-${objeto.id}"></td>
      <td>
        <button class="modificar" data-id="${objeto.id}">Modificar</button>
        <button class="borrar" data-id="${objeto.id}">Borrar</button>
      </td>
    `;
    tablaDatos.appendChild(nuevaFila);

    // Agregar eventos a los botones
    const modificar = nuevaFila.querySelector('.modificar');

//Evento Modificar Dato
modificar.addEventListener('click', async () => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Quieres modificar este dato?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, modificar'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const id = modificar.getAttribute('data-id');
      const nombre = document.getElementById(`nombre-${id}`).value;
      const imagen = document.getElementById(`imagen-${id}`).value;
      const pagina = document.getElementById(`pagina-${id}`).value;
      const publicidad = {
        nombre: nombre,
        imagen: imagen,
        pagina: pagina
      };
      await actualizarPublicidad(id, selectedArray, publicidad);
       respuesta = await obtenerPublicidad(); // Agrega esta línea
        await mostrarTabla(); // Recargar la tabla de arrays
  await mostrarDatosTabla(); // Recargar la tabla de datos
      Swal.fire({
        icon: 'success',
        title: 'Dato modificado con éxito',
        timer: 1500,
        showConfirmButton: false
      });
      await mostrarTabla(); // Recargar la tabla de arrays
      await mostrarDatosTabla(); // Recargar la tabla de datos
    }
  });
});

//Evento Borrar Dato
const borrar = nuevaFila.querySelector('.borrar');
borrar.addEventListener('click', () => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Quieres borrar este dato?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, borrar'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const id = borrar.getAttribute('data-id');
      await eliminarPublicidad(id, selectedArray);
      respuesta = await obtenerPublicidad(); // Agrega esta línea
      await mostrarTabla(); // Recargar la tabla de arrays
      await mostrarDatosTabla(); // Recargar la tabla de datos
      Swal.fire({
        icon: 'success',
        title: 'Dato borrado con éxito',
        timer: 1500,
        showConfirmButton: false
      });
    }
  });
});

  nuevaFila.addEventListener('click', () => {
      const imagenSeleccionada = document.getElementById('imagen-seleccionada');
      imagenSeleccionada.src = objeto.imagen;
    });
});
}

document.addEventListener('DOMContentLoaded', () => {
  mostrarTabla();
  
});

// Evento despliega botones para agregar publicidad
document.getElementById('agregarDato').addEventListener('click', () => {
  const agregarBotones = document.getElementById('agregar-botones');
  agregarBotones.innerHTML = `
    <input type="text" id="nombre-nuevo" placeholder="Nombre">
    <input type="text" id="imagen-nueva-ruta" placeholder="Ruta de la imagen" readonly>
    <input type="text" id="pagina-nueva" placeholder="URL de la página web">
    <input type="file" id="imagen" accept="image/*">
    <button id="subir-imagen">Subir imagen</button>
    <button id="aceptar-agregar">Aceptar</button>
    <button id="cancelar-agregar">Cancelar</button>
  `;

// Evento para subir la imagen desde el dispositivo
document.getElementById('subir-imagen').addEventListener('click', () => {
  const archivo = document.getElementById('imagen').files[0];
  const formData = new FormData();
  formData.append('imagen', archivo);
  formData.append('tipo', 'patrocinio');

fetch('/subirImagen', {
  method: 'POST',
  body: formData,
})
.then((response) => response.json())
.then((data) => {
  console.log('Respuesta del servidor:', data);
  const rutaCarpeta = '../assets/imagenesPatrocinio/';
  const rutaImagen = `${rutaCarpeta}${data.filename}`;
  console.log('Ruta de la imagen:', rutaImagen);
  document.getElementById('imagen-nueva-ruta').value = rutaImagen;
})
.catch((error) => console.error('Error al subir imagen:', error));
});

// Evento para confirmar agregar publicidad
document.getElementById('aceptar-agregar').addEventListener('click', async () => {
  if (!selectedArray) {
    Swal.fire({
      icon: 'error',
      title: 'No se ha seleccionado un array',
      text: 'Por favor, seleccione un array en la tabla de arrays.',
    });
    return;
  }

  const objeto = {
    nombre: document.getElementById('nombre-nuevo').value,
    imagen: document.getElementById('imagen-nueva-ruta').value,
    pagina: document.getElementById('pagina-nueva').value
  };

  Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Quieres agregar este dato?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, agregar'
  }).then((result) => {
    if (result.isConfirmed) {
      agregarPublicidad(selectedArray, objeto).then(async () => {
        respuesta = await obtenerPublicidad();
        await mostrarTabla();
        await mostrarDatosTabla();
        Swal.fire({
          icon: 'success',
          title: 'Dato agregado con éxito',
          timer: 1500,
          showConfirmButton: false
        });
        agregarBotones.innerHTML = '';
      });
  document.getElementById('imagen-previa').src = '';
  document.getElementById('imagen').value = ''; 
    }
  });
});

document.getElementById('imagen').addEventListener('change', (e) => {
  const archivo = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const imagenPrevia = document.getElementById('imagen-previa');
    imagenPrevia.src = reader.result;
  };
  reader.readAsDataURL(archivo);
});

// Evento cancela agregar publicidad y guarda botones
  document.getElementById('cancelar-agregar').addEventListener('click', () => {
  agregarBotones.innerHTML = '';
  document.getElementById('imagen-previa').src = '';
  document.getElementById('imagen').value = ''; 
  });
});