document.addEventListener('DOMContentLoaded', () => {
  const categoria = localStorage.getItem('categoria');
  if (categoria) {
    mostrarProfesionales(categoria);
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
  const cartelPrincipal = document.querySelector('.cartelPrincipal');
  cartelPrincipal.textContent = categoria;

  // Cargar profesionales y trabajos juntos
  Promise.all([
    fetch('../datos/usuarios.json').then(res => res.json()),
    fetch('../datos/trabajos.json').then(res => res.json())
  ])
  .then(([usuarios, trabajos]) => {
    const profesionales = usuarios.filter(profesional =>
      profesional.rubros.some(rubro => rubro.toLowerCase() === categoria.toLowerCase())
    );

    const profesionalesContainer = document.getElementById('listaProfesionales');
    profesionalesContainer.innerHTML = '';

    if (profesionales.length === 0) {
      profesionalesContainer.innerHTML = '<p class="cartelNoHay">No hay profesionales registrados por el momento.</p>';
      return;
    }

    // Para cada profesional, calcular su promedio de valoraciones en este rubro
    const tarjetas = profesionales.map(profesional => {
      const trabajosDeEsteProfesional = trabajos.filter(t =>
        t.profesionalEmail === profesional.email &&
        t.rubro.toLowerCase() === categoria.toLowerCase() &&
        t.valoracion !== null
      );

      let promedio = 'Sin valoraciones';
      if (trabajosDeEsteProfesional.length > 0) {
        const suma = trabajosDeEsteProfesional.reduce((acc, t) => acc + t.valoracion, 0);
        promedio = (suma / trabajosDeEsteProfesional.length).toFixed(1);
      }

      return {
        profesional,
        promedio
      };
    });

    // Ordenar por promedio de mayor a menor (los sin valoraciones quedan al final)
    tarjetas.sort((a, b) => {
      if (a.promedio === 'Sin valoraciones') return 1;
      if (b.promedio === 'Sin valoraciones') return -1;
      return parseFloat(b.promedio) - parseFloat(a.promedio);
    });

    // Renderizar tarjetas
    tarjetas.forEach(({ profesional, promedio }) => {
      const estado = profesional.estado;
      const tarjetaHTML = `
        <article class="profesional-item" data-email="${profesional.email}" data-telefono="${profesional.telefono}">
          <img src="${profesional.avatar}" alt="${profesional.nombre}">
          <div class="profesional-data">
            <h2>${profesional.nombre} ${profesional.apellido}.</h2>
            <h2>${profesional.empresa}.</h2>
            <p>Email: ${profesional.email}</p>
            <p>Tel: ${profesional.telefono}</p>
            <p>Dirección: ${profesional.direccion}</p>
            <p>Valoración promedio: ${promedio}</p>
          </div>
          <div class="profesional-buttons">
            <button class="verMas">Ver Más</button>
            <button class="conectar">Conectar</button>
            <button class="contratar">Contratar</button>
            <label id="disponible" class="${estado ? 'disponible' : 'no-disponible'}">${estado ? 'Disponible' : 'No Disponible'}</label>
          </div>
        </article>
      `;
      profesionalesContainer.insertAdjacentHTML('beforeend', tarjetaHTML);
    });

    // Eventos para botones
    profesionalesContainer.addEventListener('click', (e) => {
      const profesionalItem = e.target.closest('.profesional-item');
      if (!profesionalItem) return;

      const emailProfesional = profesionalItem.getAttribute('data-email');

      if (e.target.classList.contains('verMas')) {
        localStorage.setItem('emailProfesional', emailProfesional);
        window.location.href = 'tarjetaProfesional.html';
      }

      if (e.target.classList.contains('conectar')) {
        const telefonoProfesional = profesionalItem.getAttribute('data-telefono');
        abrirWhatsApp(telefonoProfesional);
      }

      if (e.target.classList.contains('contratar')) {
        contratarProfesional(emailProfesional);
      }
    });
  })
  .catch(error => console.error('Error cargando los datos:', error));
}

function contratarProfesional(emailProfesional) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const emailUsuario = currentUser ? currentUser.email : null;
  const rubro = localStorage.getItem('categoria');

  // Validar login
  if (!emailUsuario) {
    Swal.fire({
      icon: 'warning',
      title: 'Atención',
      text: 'Debes iniciar sesión para contratar un profesional.',
      confirmButtonColor: '#3b82f6'
    });
    return;
  }

  // Validar tipo de usuario
  if (currentUser.tipo !== 'comun') {
    Swal.fire({
      icon: 'error',
      title: 'Acceso denegado',
      text: 'Solo los usuarios registrados como clientes pueden contratar profesionales.',
      confirmButtonColor: '#ef4444'
    });
    return;
  }

  const nuevoTrabajo = {
    id: generarUUID(),
    profesionalEmail: emailProfesional,
    usuarioEmail: emailUsuario,
    rubro: rubro,
    estado: 'pendiente',
    valoracion: null,
    comentario: "",
    fechaContratacion: new Date().toISOString().split('T')[0]
  };

  // Enviar al servidor
  fetch('http://localhost:3000/api/trabajos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(nuevoTrabajo)
  })
  .then(res => {
    if (!res.ok) {
      throw new Error('Error al contratar. Intenta nuevamente.');
    }
    return res.json();
  })
  .then(() => {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: '¡Trabajo contratado con éxito!',
      confirmButtonColor: '#10b981'
    });
  })
  .catch(error => {
    console.error('Error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al contratar el servicio.',
      confirmButtonColor: '#ef4444'
    });
  });
}

function generarUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function abrirWhatsApp(telefono) {
  const numeroConPrefijo = `+54${telefono}`;
  const url = `https://wa.me/${numeroConPrefijo}`;
  window.open(url, '_blank');
}

function startCarruselHorizontal(containerId, items, interval) {
  const container = document.querySelector(`#${containerId}`);
  container.style.display = 'flex';
  container.style.flexDirection = 'row';
  container.style.overflowX = 'hidden';
  container.style.width = `${items.length * 100}%`;

  items.forEach((item) => {
    const carruselItem = document.createElement('div');
    carruselItem.classList.add('carrusel-item');
    carruselItem.style.width = '100vw';
    carruselItem.style.flexShrink = 0;
    carruselItem.style.display = 'inline-block';
    carruselItem.innerHTML = `<img src="${item.imagen}" alt="${item.nombre}";">`;
    container.appendChild(carruselItem);
  });

  let currentIndex = 0;
  setInterval(() => {
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
    carruselItem.innerHTML = `<img src="${item.imagen}" alt="${item.nombre}";">`;
    container.appendChild(carruselItem);
  });

  let currentIndex = 0;
  setInterval(() => {
    currentIndex = (currentIndex + 1) % items.length;
    container.style.top = `-${currentIndex * 200}px`;
  }, interval);
}