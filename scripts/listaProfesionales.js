document.addEventListener('DOMContentLoaded', () => {
  const categoria = localStorage.getItem('categoria');
  if (categoria) {
    mostrarProfesionales(categoria); // Llama a la función que muestra los profesionales
  } else {
    console.error('No se especificó una categoría');
  }

const mediaQuery = window.matchMedia('(max-width: 700px)');
fetch('../datos/publicidad.json')
  .then(response => response.json())
  .then(data => {
    const publicidad1 = data.publicidad1;
    const publicidad2 = data.publicidad2;
    const containerId1 = 'prop1';
    const containerId2 = 'prop2';
    const interval = 3000;

    if (mediaQuery.matches) {
      startCarruselHorizontal(containerId1, publicidad1, interval);
      startCarruselHorizontal(containerId2, publicidad2, interval);
    } else {
      startCarruselVertical(containerId1, publicidad1, interval);
      startCarruselVertical(containerId2, publicidad2, interval);
    }

    mediaQuery.addEventListener('change', (mq) => {
      if (mq.matches) {
        startCarruselHorizontal(containerId1, publicidad1, interval);
        startCarruselHorizontal(containerId2, publicidad2, interval);
      } else {
        startCarruselVertical(containerId1, publicidad1, interval);
        startCarruselVertical(containerId2, publicidad2, interval);
      }
    });
  })
  .catch(error => console.error('Error cargando el JSON:', error));

});


function mostrarProfesionales(categoria) {
  // Cargar el oficio en el h2
  const cartelPrincipal = document.querySelector('.cartelPrincipal');
  cartelPrincipal.textContent = categoria;

  // Cargar el JSON con los datos de los profesionales
  fetch('../datos/usuarios.json')
    .then(response => response.json())
    .then(data => {
      const profesionales = data.filter(profesional => profesional.rubros.some(rubro => rubro.toLowerCase() === categoria.toLowerCase()));
      const profesionalesContainer = document.getElementById('listaProfesionales');

      if (profesionales.length > 0) {
        // Ordenar los profesionales por valuación de mayor a menor
        profesionales.sort((a, b) => parseFloat(b.valuacion) - parseFloat(a.valuacion));

        // Limpiar el contenedor antes de agregar nuevos elementos
        profesionalesContainer.innerHTML = '';

        profesionales.forEach((profesional) => {
          const estado = profesional.estado;
          const tarjetaHTML = `
            <article class="profesional-item" data-email="${profesional.email}">
              <img src="${profesional.avatar}" alt="${profesional.nombre}">
              <div class="profesional-data">
                <h2>${profesional.nombre} ${profesional.apellido}.</h2>
                <h2>${profesional.empresa}.</h2>
                <p>Email: ${profesional.email}</p>
                <p>Tel: ${profesional.telefono}</p>
                <p>Dirección: ${profesional.direccion}</p>
                <p>Valoración: ${profesional.valuacion}</p>
              </div>
              <div class="profesional-buttons">
                <button class="verMas">Ver Más</button>
                <button class="conectar">Conectar</button>
                <label id="disponible" class="${estado ? 'disponible' : 'no-disponible'}">${estado ? 'Disponible' : 'No Disponible'}</label>
              </div>
              
            </article>
          `;
          profesionalesContainer.insertAdjacentHTML('beforeend', tarjetaHTML);
        });

        profesionalesContainer.addEventListener('click', (e) => {
          if (e.target.classList.contains('verMas')) {
            const profesionalItem = e.target.closest('.profesional-item');
            const emailProfesional = profesionalItem.getAttribute('data-email');

            // Guardar el email del profesional seleccionado en localStorage
            localStorage.setItem('emailProfesional', emailProfesional);

            // Redirigir a la otra página
            window.location.href = 'tarjetaProfesional.html';
          }
        });
      } else {
        profesionalesContainer.innerHTML = '<p class="cartelNoHay">No hay profesionales registrados por el momento.</p>';
      }
    })
    .catch(error => console.error('Error cargando el JSON:', error));
}










/*
function mostrarProfesionales(categoria) {
  // Cargar el oficio en el h2
  const cartelPrincipal = document.querySelector('.cartelPrincipal');
  cartelPrincipal.textContent = categoria;

  // Cargar el JSON con los datos de los profesionales
  fetch('../datos/usuarios.json')
    .then(response => response.json())
    .then(data => {
const profesionales = data.filter(profesional => profesional.rubros.some(rubro => rubro.toLowerCase() === categoria.toLowerCase()));

      const profesionalesContainer = document.getElementById('listaProfesionales');

      if (profesionales.length > 0) {
        // Ordenar los profesionales por valuación de mayor a menor
        profesionales.sort((a, b) => parseFloat(b.valuacion) - parseFloat(a.valuacion));

        // Limpiar el contenedor antes de agregar nuevos elementos
        profesionalesContainer.innerHTML = '';

        profesionales.forEach((profesional, index) => {
          const estado = profesional.estado;
          const tarjetaHTML = `
            <article class="profesional-item" data-index="${index}">
              <img src="${profesional.imagenes}" alt="${profesional.nombre}">
              <div class="profesional-data">
                <h2>${profesional.nombre} ${profesional.apellido}</h2>
                <p>Email: ${profesional.email}</p>
                <p>Dirección: ${profesional.direccion}</p>
                <p>Valoración: ${profesional.valuacion}</p>
              </div>
              <div class="profesional-buttons">
                <button id="verMas">Ver Más</button>
                <button id="conectar">Conectar</button>
                <label id="disponible" class="${estado ? 'disponible' : 'no-disponible'}">${estado ? 'Disponible' : 'No Disponible'}</label>
              </div>
            </article>
          `;
          profesionalesContainer.insertAdjacentHTML('beforeend', tarjetaHTML);
        });

        profesionalesContainer.addEventListener('click', (e) => {
          if (e.target.id === 'verMas') {
            const profesionalItem = e.target.closest('.profesional-item');
            const indexProfesional = profesionales.findIndex(profesional => profesional.email === profesionalItem.querySelector('h2').textContent.split(' ')[0] + ' ' + profesionalItem.querySelector('h2').textContent.split(' ')[1]);
            // Guardar el ID del profesional seleccionado en localStorage
            localStorage.setItem('idProfesional', indexProfesional);
            // Redirigir a la otra página
            window.location.href = 'tarjetaProfesional.html';
          }
        });
      } else {
        profesionalesContainer.innerHTML = '<p class="cartelNoHay">No hay profesionales registrados por el momento.</p>';
      }
    })
    .catch(error => console.error('Error cargando el JSON:', error));
}
      */
    
function startCarruselHorizontal(containerId, items, interval) {
  const container = document.querySelector(`#${containerId}`);
  container.style.display = 'flex';
  container.style.flexDirection = 'row';
  container.style.overflowX = 'hidden';
  container.style.width = `${items.length * 100}%`; // Configura el ancho del contenedor

  items.forEach((item) => {
    const carruselItem = document.createElement('div');
    carruselItem.classList.add('carrusel-item');
    carruselItem.style.width = '100vw';
    carruselItem.style.flexShrink = 0;
    carruselItem.style.display = 'inline-block';
    carruselItem.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}";">
    `;
    container.appendChild(carruselItem);
  });

  let currentIndex = 0;
  let intervalId = setInterval(() => {
    currentIndex = (currentIndex + 1) % items.length;
    container.style.transform = `translateX(-${currentIndex * 100}vw)`;
  }, interval);
}

function startCarruselVertical(containerId, items, interval) {
  const container = document.querySelector(`#${containerId}`);
  container.style.position = 'relative';
  container.style.overflow = 'hidden';

  items.forEach((item) => {
    const carruselItem = document.createElement('div');
    carruselItem.classList.add('carrusel-item');
    carruselItem.style.height = '200px';
    carruselItem.style.display = 'flex';
    carruselItem.style.justifyContent = 'center';
    carruselItem.style.alignItems = 'center';
    carruselItem.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}";">
    `;
    container.appendChild(carruselItem);
  });

  let currentIndex = 0;
  let intervalId = setInterval(() => {
    currentIndex = (currentIndex + 1) % items.length;
    container.style.top = `-${currentIndex * 200}px`;
  }, interval);
}