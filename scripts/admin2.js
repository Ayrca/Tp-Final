const traeListaButton = document.getElementById('traeLista');
const inputListaArray = document.getElementById('input-listaArray');
const inputLista = document.getElementById('input-lista');
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

async function obtenerPublicidadPorId(id) {
  try {
    const response = await fetch(`/publicidad/${id}`);
    const publicidad = await response.json();
    return publicidad;
  } catch (error) {
    console.error('Error al obtener la publicidad por ID:', error);
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
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

//Treae lista de array de publicidad
traeListaButton.addEventListener('click', async () => {
  const respuesta = await obtenerPublicidad();
 // console.log(respuesta);
  if (typeof respuesta === 'object') {
    inputListaArray.innerHTML = '';
    Object.keys(respuesta).forEach((key) => {
      const option = document.createElement('option');
      option.value = key;
      option.text = key;
      inputListaArray.appendChild(option);
    });
  } else {
    console.error('La respuesta del servidor no es un objeto');
  }
});

let selectedId = null;

inputListaArray.addEventListener('change', () => {
  const selectedArray = inputListaArray.value;
  const respuesta = obtenerPublicidad().then((respuesta) => {
    const array = respuesta[selectedArray];
    inputLista.innerHTML = '';
    array.forEach((item) => {
      const option = document.createElement('option');
      option.value = item.id; // Configura el valor de id
      option.text = item.nombre;
      inputLista.appendChild(option);
    });
  });
});

let selectedIdGlobal = null;
let currentItem = null;


inputLista.addEventListener('change', async () => {
  const selectedArray = inputListaArray.value;
  const selectedIndex = inputLista.selectedIndex;
  const respuesta = await obtenerPublicidad();
  const array = respuesta[selectedArray];
  array.forEach((item, index) => {
    item.id = index + 1; // Agrega una propiedad id a cada objeto
  });
  currentItem = array[selectedIndex];
  inputNombre.value = currentItem.nombre;
  inputImagen.value = currentItem.imagen;
  inputPagina.value = currentItem.pagina;
  // Mostrar la imagen en el div imagen-propaganda
  const imagenPropaganda = document.getElementById('imagen-propaganda');
  imagenPropaganda.innerHTML = `<img src="${currentItem.imagen}" alt="Imagen de propaganda">`;
});


// Función para eliminar publicidad
document.getElementById('borrarDato').addEventListener('click', async () => {
  const selectedArray = inputListaArray.value;
  const selectedId = inputLista.value;
  await eliminarPublicidad(selectedId, selectedArray);
});


// Función para modificar publicidad
document.getElementById('modificarDato').addEventListener('click', async () => {
  const publicidad = {
    nombre: document.getElementById('input-Nombre').value,
    imagen: inputImagen.value,
    pagina: inputPagina.value
  };
  const selectedArray = inputListaArray.value; // obtén el nombre del array seleccionado
  await actualizarPublicidad(currentItem.id, selectedArray, publicidad);
});

// Evento para agregar publicidad
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

  document.getElementById('aceptar-agregar').addEventListener('click', async () => {
    const nombreArray = inputListaArray.value;
    const objeto = {
      nombre: document.getElementById('nombre-nuevo').value,
      imagen: document.getElementById('imagen-nueva-ruta').value,
      pagina: document.getElementById('pagina-nueva').value
    };
    await agregarPublicidad(nombreArray, objeto);
    agregarBotones.innerHTML = '';
  });

  document.getElementById('cancelar-agregar').addEventListener('click', () => {
    agregarBotones.innerHTML = '';
  });
});

// Funcion para limpiar los imputs
function limpiarInputs() {
  inputNombre.value = '';
  inputImagen.value = '';
  inputPagina.value = '';
  inputListaArray.innerHTML = '';
  inputLista.innerHTML = '';

  // Limpiar el bloque de la imagen
  const imagenPropaganda = document.getElementById('imagen-propaganda');
  imagenPropaganda.innerHTML = '';
}

const limpiarListaButton = document.getElementById('limpiarLista');
limpiarListaButton.addEventListener('click', limpiarInputs);