document.addEventListener('DOMContentLoaded', () => {
  const categoria = localStorage.getItem('categoria');
  if (categoria) {
    mostrarProfesionales(categoria); // Llama a la función que muestra los profesionales
  } else {
    console.error('No se especificó una categoría');
  }
});

function mostrarProfesionales(categoria) {
  
  // Cargar el oficio en el h2
const cartelPrincipal = document.querySelector('.cartelPrincipal');
cartelPrincipal.textContent = categoria;

  // Cargar el JSON con los datos de los profesionales
  fetch('../datos/datos.json')
    .then(response => response.json())
    .then(data => {
      const profesionales = data[categoria];
      const profesionalesContainer = document.getElementById('listaProfesionales');

      if (profesionales && profesionales.length > 0) {
        // Limpiar el contenedor antes de agregar nuevos elementos
        profesionalesContainer.innerHTML = '';
        profesionales.forEach(profesional => {
          const tarjetaHTML = `
            <article class="profesional-item">
              <img src="${profesional.imagen}" alt="${profesional.nombre}">
              <div class="profesional-data">
                <h2>${profesional.nombre} ${profesional.apellido}</h2>
                <p>Email: ${profesional.email}</p>
                <p>Dirección: ${profesional.direccion}</p>
                <p>Valoración: ${profesional.valuacion}</p>
              </div>
              <div class="profesional-buttons">
                <button id="verMas">Ver Más</button>
                <button id="conectar">Conectar</button>
              </div>
            </article>
          `;
          profesionalesContainer.insertAdjacentHTML('beforeend', tarjetaHTML);
        });
      } else {
        profesionalesContainer.innerHTML = '<p class="cartelNoHay">No hay profesionales registrados por el momento.</p>';
      }
    })
    .catch(error => console.error('Error cargando el JSON:', error));
}


/*Carrueles de publicidad*/


function startCarrusel(containerId, items, itemHeight = 200, interval = 3000) {
  const container = document.querySelector(`#${containerId}`);
  let currentIndex = 0;
  let intervalId;

  // Generar los elementos del carrusel
  items.forEach((item) => {
    const carruselItem = document.createElement('div');
    carruselItem.classList.add('carrusel-item');
    carruselItem.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}">
    `;
    container.appendChild(carruselItem);
  });


  // Iniciar el carrusel
  intervalId = setInterval(() => {
    currentIndex = (currentIndex + 1) % items.length;
    const top = -currentIndex * itemHeight;
    container.style.top = `${top}px`;
  }, interval);
}

// Cargar los datos del JSON
fetch('../datos/datos.json')
  .then(response => response.json())
  .then(data => {
    const publicidad1 = data.publicidad1;
    const publicidad2 = data.publicidad2;

    // Iniciar los carruseles
    startCarrusel('prop1', publicidad1);
    startCarrusel('prop2', publicidad2);



     })
  .catch(error => console.error('Error cargando el JSON:', error));
