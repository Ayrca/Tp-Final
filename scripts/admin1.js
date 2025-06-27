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
    
    imagen: inputImagen.value, // utiliza la ruta de la imagen actualizada
  };
  await actualizarPublicidad(currentItem.id, 'publicidad', publicidad);
});


// Evento para agregar publicidad

document.getElementById('agregarDato').addEventListener('click', async () => {
  const nombreArray = inputListaArray.value;
  const objeto = {
    nombre: inputNombre.value,
    imagen: inputImagen.value, // utiliza la ruta de la imagen actualizada
  };
  await agregarPublicidad(nombreArray, objeto);
});



// Funcion para limpiar los imputs
function limpiarInputs() {
  inputNombre.value = '';
  inputImagen.value = '';
  inputPagina.value = '';
  inputListaArray.innerHTML = '';
  inputLista.innerHTML = '';
}


botonSubir.addEventListener('click', () => {
  const archivo = inputImagen1.files[0];
  const formData = new FormData();
  formData.append('imagen', archivo);

  fetch('/subir-imagen', {
    method: 'POST',
    body: formData,
  })
  .then((response) => response.json())
  .then((data) => {
    const rutaImagen = data.filename; // suponiendo que el servidor devuelve la ruta de la imagen
    inputImagen.value = rutaImagen; // actualiza el valor del input "inputImagen"
  })
  .catch((error) => console.error(error));
});

inputImagen1.addEventListener('change', () => {
  const archivo = inputImagen1.files[0];
  const rutaArchivo = URL.createObjectURL(archivo);
  inputImagen.value = rutaArchivo;
});



const limpiarListaButton = document.getElementById('limpiarLista');
limpiarListaButton.addEventListener('click', limpiarInputs);