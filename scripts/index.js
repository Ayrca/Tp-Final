const buscador = document.getElementById('buscador');
const resultados = document.getElementById('resultados');
let seleccionRealizada = false;
let oficioSeleccionado = null;

/*buscador*/ 
let oficiosData = [];

function buscarOficios() {
  const textoBusqueda = buscador.value.toLowerCase();
  const resultadosFiltrados = oficiosData.filter(oficio => oficio && oficio.nombre && oficio.nombre.toLowerCase().startsWith(textoBusqueda));

  if (resultadosFiltrados.length > 0) {
    const htmlResultados = resultadosFiltrados.map((oficio, index) => `
      <div class="resultado" data-index="${index}">
        <p>${oficio.nombre}</p>
      </div>
    `).join('');
    resultados.innerHTML = htmlResultados;
    const resultadoDivs = document.querySelectorAll('.resultado');
    resultadoDivs.forEach((div, index) => {
      div.addEventListener('mousedown', (e) => {
        e.preventDefault();
        oficioSeleccionado = resultadosFiltrados[index];
        buscador.value = oficioSeleccionado.nombre;
        resultados.innerHTML = '';
        seleccionRealizada = true;
        buscador.focus();
      });
    });
  } else {
    resultados.innerHTML = '<p>No se encontraron resultados</p>';
  }
};

buscador.addEventListener('blur', () => {
  if (!seleccionRealizada) {
    resultados.innerHTML = '';
  } else {
    seleccionRealizada = false;
  }
});
/*Buscador*/

// Función para crear carrusel de oficios

const oficioContainer = document.getElementById('oficio-container');

function crearArticulos(oficios) {
  const oficioContainer = document.getElementById('oficio-container');
  oficios.forEach(oficio => {
    const articuloHTML = `
      <article class="oficio-item">
        <a class="Acard" data-categoria="${oficio.nombre}" href="#">
          <button class="btnIndexcard">
            <img src="${oficio.imagen}" alt="${oficio.nombre}">
          </button>
          <h2>${oficio.nombre}</h2>
        </a>
      </article>
    `;
    oficioContainer.insertAdjacentHTML('beforeend', articuloHTML);
  });

  // Agregar evento de clic a los elementos .Acard después de crearlos
  const cards = document.querySelectorAll('.Acard');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const categoria = card.getAttribute('data-categoria');
      window.location.href = `prueba.html?categoria=${categoria}`;
    });
  });
}

/*movimiento de las tarjetas de oficio*/
const tarjetasContainer1 = document.querySelector('#oficio-container');

const anterior1 = document.getElementById('anterior1');
const siguiente1 = document.getElementById('siguiente1');

// Eventos de mouse para desktop
let isDown1 = false;
let startX1;
let scrollLeft1;


// Eventos de mouse para desktop
tarjetasContainer1.addEventListener('mousedown', (e) => {
  e.preventDefault();
  isDown1 = true;
  startX1 = e.pageX - tarjetasContainer1.offsetLeft;
  scrollLeft1 = tarjetasContainer1.scrollLeft;
});

tarjetasContainer1.addEventListener('mouseleave', () => {
  isDown1 = false;
});

tarjetasContainer1.addEventListener('mouseup', () => {
  isDown1 = false;
});

tarjetasContainer1.addEventListener('mousemove', (e) => {
  if (!isDown1) return;
  e.preventDefault();
  const x = e.pageX - tarjetasContainer1.offsetLeft;
  const walk = (x - startX1) * 1;
  tarjetasContainer1.scrollLeft = scrollLeft1 - walk;
});

// Eventos de touch para mobile
tarjetasContainer1.addEventListener('touchstart', (e) => {
  isDown1 = true;
  startX1 = e.touches[0].pageX - tarjetasContainer1.offsetLeft;
  scrollLeft1 = tarjetasContainer1.scrollLeft;
});

tarjetasContainer1.addEventListener('touchend', () => {
  isDown1 = false;
});

tarjetasContainer1.addEventListener('touchmove', (e) => {
  if (!isDown1) return;
  e.preventDefault();
  const x = e.touches[0].pageX - tarjetasContainer1.offsetLeft;
  const walk = (x - startX1) * 1;
  tarjetasContainer1.scrollLeft = scrollLeft1 - walk;
});


function smoothScrollTo1(element, to, duration) {
  const start = element.scrollLeft;
  const change = to - start;
  let startTime = null;

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = timestamp - startTime;
    const val = Math.easeInOutQuad(progress, start, change, duration);
    element.scrollLeft = val;
    if (progress < duration) {
      requestAnimationFrame(animate);
    }
  }
  requestAnimationFrame(animate);
}

Math.easeInOutQuad = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};

anterior1.addEventListener('click', () => {
  const itemWidth = document.querySelector('.oficio-item').offsetWidth + 20; 
  const to = tarjetasContainer1.scrollLeft - itemWidth;
  if (to < 0) {
    smoothScrollTo1(tarjetasContainer1, 0, 100);
  } else {
    smoothScrollTo1(tarjetasContainer1, to, 100);
  }
});

siguiente1.addEventListener('click', () => {
  const itemWidth = document.querySelector('.oficio-item').offsetWidth + 20; 
  const to = tarjetasContainer1.scrollLeft + itemWidth;
  if (to > tarjetasContainer1.scrollWidth - tarjetasContainer1.offsetWidth) {
    smoothScrollTo1(tarjetasContainer1, tarjetasContainer1.scrollWidth - tarjetasContainer1.offsetWidth, 100);
  } else {
    smoothScrollTo1(tarjetasContainer1, to, 100);
  }
});


const propagandaContainer = document.getElementById('propaganda1');
//const propagandaContainer = document.querySelector('.propaganda');
let isDown = false;
let startX;
let scrollLeft;
let currentSlide = 0;
let intervalId;


/*Crea el carrusel de propaganda*/ 

function crearPropaganda(publicidad) {
  const propagandaContainer = document.getElementById('propaganda1');
  publicidad.forEach((anuncio) => {
    const articuloHTML = `
      <article class="propaganda2">
      <h2>${anuncio.nombre}</h2>
        <img src="${anuncio.imagen}" alt="${anuncio.nombre}">
      </article>
    `;
    propagandaContainer.insertAdjacentHTML('beforeend', articuloHTML);
  });


      // Agregar eventos de mouse y touch para desplazar el carrusel
      propagandaContainer.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDown = true;
        startX = e.pageX - propagandaContainer.offsetLeft;
        scrollLeft = propagandaContainer.scrollLeft;
      });

      propagandaContainer.addEventListener('mouseleave', () => {
        isDown = false;
      });

      propagandaContainer.addEventListener('mouseup', () => {
        isDown = false;
      });

      propagandaContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - propagandaContainer.offsetLeft;
        const walk = (x - startX) * 1;
        propagandaContainer.scrollLeft = scrollLeft - walk;
      });

      propagandaContainer.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - propagandaContainer.offsetLeft;
        scrollLeft = propagandaContainer.scrollLeft;
      });

      propagandaContainer.addEventListener('touchend', () => {
        isDown = false;
      });

      propagandaContainer.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.touches[0].pageX - propagandaContainer.offsetLeft;
        const walk = (x - startX) * 1;
        propagandaContainer.scrollLeft = scrollLeft - walk;
      });

      // Función para desplazar las imágenes de forma automatica cada 3 segundos
      function autoScroll() {
        intervalId = setInterval(() => {
          const itemWidth = document.querySelector('.propaganda2').offsetWidth;
          propagandaContainer.scrollLeft += itemWidth;
          if (propagandaContainer.scrollLeft >= propagandaContainer.scrollWidth - propagandaContainer.offsetWidth) {
            propagandaContainer.scrollLeft = 0;
          }
        }, 3000); // Desplazar cada 3 segundos
      }

      autoScroll();
       
/*Movimiento del carrusel propaganda*/ 
      // Pausar el desplazamiento automático cuando se interactúa con el carrusel
      propagandaContainer.addEventListener('mousedown', () => {
        clearInterval(intervalId);
      });

      propagandaContainer.addEventListener('touchstart', () => {
        clearInterval(intervalId);
      });

      // Reanudar el desplazamiento automático cuando se deja de interactuar con el carrusel
      propagandaContainer.addEventListener('mouseup', () => {
        autoScroll();
      });

      propagandaContainer.addEventListener('touchend', () => {
        autoScroll();
      });
     
}
/*Movimiento del carrusel propaganda*/ 

/*llamado del json y ejecucion de los carruseles, con el buscador en tiempo real*/ 
  
fetch('datos/datos.json')
  .then(response => response.json())
  .then(data => {
    oficiosData = data.oficios;
    crearArticulos(oficiosData);
    crearPropaganda(data.publicidad);
    // Habilitar el buscador después de cargar los datos
    buscador.addEventListener('input', buscarOficios);
  })
  .catch(error => console.error('Error al cargar datos:', error));