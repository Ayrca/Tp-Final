const traeListaButton = document.getElementById('traeLista');
const inputListaArray = document.getElementById('input-listaArray');
const inputLista = document.getElementById('input-lista');
const inputNombre = document.getElementById('input-Nombre');
const inputImagen = document.getElementById('input-Imagen');
const inputImagen1 = document.getElementById('imagen');

const botonSubir = document.getElementById('subir-imagen');



// Función para traer la lista de oficios
document.getElementById('traeLista').addEventListener('click', async () => {
  try {
    const response = await fetch('../datos/datos.json');
    const data = await response.json();
    const oficios = data.oficios;
    // Llena el select con el array de oficios
    const inputListaArray = document.getElementById('input-listaArray');
    inputListaArray.innerHTML = '';
    const option = document.createElement('option');
    option.value = 'oficios';
    option.text = 'Oficios';
    inputListaArray.appendChild(option);
    // Evento para seleccionar el array de oficios
    inputListaArray.addEventListener('change', () => {
      const selectedArray = inputListaArray.value;
      if (selectedArray === 'oficios') {
        const inputLista = document.getElementById('input-lista');
        inputLista.innerHTML = '';
        oficios.forEach((oficio) => {
          const option = document.createElement('option');
          option.value = oficio.nombre; // Utiliza el nombre del oficio como valor
          option.text = oficio.nombre;
          inputLista.appendChild(option);
        });
        inputLista.addEventListener('change', () => {
          if (inputLista.value !== '') {
            const selectedOficio = oficios.find((oficio) => oficio.nombre === inputLista.value);
            if (selectedOficio) {
              document.getElementById('input-Nombre').value = selectedOficio.nombre;
              document.getElementById('input-Imagen').value = selectedOficio.imagen;
              const imagenPropaganda = document.getElementById('imagen-propaganda');
              imagenPropaganda.innerHTML = `<img src="${selectedOficio.imagen}" alt="Imagen de propaganda">`;
            } else {
            //  console.log('Oficio no encontrado, pero no es un error crítico');
            }
          }
        });
      }
    });
  } catch (error) {
    console.error('Error al obtener la publicidad:', error);
  }
});



function actualizarListaOficios() {
  fetch('../datos/datos.json')
    .then(response => response.json())
    .then(data => {
      const oficios = data.oficios;
      const inputLista = document.getElementById('input-lista');
      inputLista.innerHTML = '';
      oficios.forEach((oficio) => {
        const option = document.createElement('option');
        option.value = oficio.nombre;
        option.text = oficio.nombre;
        inputLista.appendChild(option);
      });
      inputLista.addEventListener('change', () => {
        const selectedOficio = oficios.find((oficio) => oficio.nombre === inputLista.value);
        if (selectedOficio) {
          document.getElementById('input-Nombre').value = selectedOficio.nombre;
          document.getElementById('input-Imagen').value = selectedOficio.imagen;
          const imagenPropaganda = document.getElementById('imagen-propaganda');
          imagenPropaganda.innerHTML = `<img src="${selectedOficio.imagen}" alt="Imagen de propaganda">`;
        } else {
       //   console.error('Oficio no encontrado');
        }
      });
    });
}


// Funcion para limpiar los imputs
function limpiarInputs() {
  inputNombre.value = '';
  inputImagen.value = '';
  inputListaArray.innerHTML = '';
  inputLista.innerHTML = '';

  // Evento limpiar el bloque de la imagen
  const imagenPropaganda = document.getElementById('imagen-propaganda');
  imagenPropaganda.innerHTML = '';
}

async function borrarOficio(nombreOficio) {
  console.log('Nombre del oficio a borrar:', nombreOficio);
  try {
    const response = await fetch(`/datos/oficios/${nombreOficio}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (data.success) {
      console.log('Oficio borrado con éxito');
      // Actualiza la lista de oficios
      inputListaArray.dispatchEvent(new Event('change'));
    } else {
      console.error('Error al borrar oficio:', data.error);
    }
  } catch (error) {
    console.error('Error al borrar oficio:', error);
  }
}




async function agregarOficio(nombreArray, objeto) {
  try {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(objeto),
    };
    await fetch('../datos/oficios', options);
  } catch (error) {
    console.error('Error al agregar Oficio:', error);
  }
}



async function modificarDato(nombre, nuevoNombre, imagen) {
  try {
    const response = await fetch('../datos/datos.json');
    const data = await response.json();
    const oficios = data.oficios;
    const oficioIndex = oficios.findIndex((oficio) => oficio.nombre === nombre);
    if (oficioIndex !== -1) {
      const objeto = { nombre: nuevoNombre, imagen };
      const options = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(objeto),
      };
      await fetch(`../datos/oficios/${oficioIndex}`, options);
    } else {
   //   console.error('Oficio no encontrado');
    }
  } catch (error) {
    console.error('Error al modificar el dato:', error);
  }
}




document.getElementById('modificarDato').addEventListener('click', async () => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Quieres guardar los cambios?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, guardar'
  }).then((result) => {
    if (result.isConfirmed) {
      const nombreAnterior = inputLista.options[inputLista.selectedIndex].text; // Obtén el nombre anterior del oficio
      const nombre = document.getElementById('input-Nombre').value;
      const imagen = document.getElementById('input-Imagen').value;
      modificarDato(nombreAnterior, nombre, imagen).then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Oficio modificado con éxito',
          timer: 1500,
          showConfirmButton: false
        });
        actualizarListaOficios();
      });
    }
  });
});


// Evento despliega botones para agregar publicidad
document.getElementById('agregarDato').addEventListener('click', () => {
  const agregarBotones = document.getElementById('agregar-botones');
  agregarBotones.innerHTML = `
    <input type="text" id="nombre-nuevo" placeholder="Nombre">
    <input type="text" id="imagen-nueva-ruta" placeholder="Ruta de la imagen" readonly>
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
formData.append('tipo', 'oficios');

fetch('/subirImagen', {
  method: 'POST',
  body: formData,
})
.then((response) => response.json())
.then((data) => {
  console.log('Respuesta del servidor:', data);
  const rutaCarpeta = '../assets/images/oficios/';
  const rutaImagen = `${rutaCarpeta}${data.filename}`;
  console.log('Ruta de la imagen:', rutaImagen);
  document.getElementById('imagen-nueva-ruta').value = rutaImagen;
})
.catch((error) => console.error('Error al subir imagen:', error));
});

// Evento para confirmar agregar publicidad
document.getElementById('aceptar-agregar').addEventListener('click', async () => {
  const nombreArray = inputListaArray.value;
  const objeto = {
    nombre: document.getElementById('nombre-nuevo').value,
    imagen: document.getElementById('imagen-nueva-ruta').value,
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
      agregarOficio(nombreArray, objeto).then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Dato agregado con éxito',
          timer: 1500,
          showConfirmButton: false
        });
        agregarBotones.innerHTML = '';
       // inputListaArray.dispatchEvent(new Event('change'));
         actualizarListaOficios();
      });
    }
  });
});

// Evento cancela agregar oficio y guarda botones
  document.getElementById('cancelar-agregar').addEventListener('click', () => {
    agregarBotones.innerHTML = '';
  });
});

document.getElementById('borrarDato').addEventListener('click', async () => {
  const nombreOficio = document.getElementById('input-Nombre').value;
  Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Quieres borrar este oficio?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, borrar'
  }).then((result) => {
    if (result.isConfirmed) {
      borrarOficio(nombreOficio).then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Oficio borrado con éxito',
          timer: 1500,
          showConfirmButton: false
        });
       // inputListaArray.dispatchEvent(new Event('change'));
         actualizarListaOficios();
      });
    }
  });
});


// Evento para modificar dato
document.getElementById('modificarDato').addEventListener('click', async () => {
  const index = document.getElementById('input-lista').value;
  const nombre = document.getElementById('input-Nombre').value;
  const imagen = document.getElementById('input-Imagen').value;
  await modificarDato(index, nombre, imagen);
});

// Evento limpiar el bloque de la imagen
const limpiarListaButton = document.getElementById('limpiarLista');
limpiarListaButton.addEventListener('click', limpiarInputs);