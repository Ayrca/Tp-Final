function mostrarTarjetaProfesional() {
  // Obtener el email del profesional seleccionado desde localStorage
  const emailProfesional = localStorage.getItem('emailProfesional');

  // Cargar usuarios y trabajos (para obtener nombre de cliente en valoraciones)
  Promise.all([
    fetch('../datos/usuarios.json').then(res => res.json()),
    fetch('../datos/trabajos.json').then(res => res.json())
  ])
  .then(([usuarios, trabajos]) => {
    const profesional = usuarios.find(p => p.email === emailProfesional);

    if (!profesional) {
      console.error('No se encontró el profesional');
      return;
    }

const contenidoContainer = document.getElementById('contenidoProfesional');
contenidoContainer.innerHTML = ''; // borra solo el contenido dinámico

    // Tarjeta profesional (foto + datos)
    const tarjetaProfesional = document.createElement('div');
    tarjetaProfesional.classList.add('tarjetaProfesional');
    tarjetaProfesional.innerHTML = `
      <img src="${profesional.avatar}" alt="Foto del profesional">
      <div class="datosProfesional">
        <ul>
          <li>Rubros: ${profesional.rubros.join(', ')}</li>
          <li>${profesional.nombre} ${profesional.apellido}</li>
          <li>${profesional.empresa}</li>
          <li>Email: ${profesional.email}</li>
          <li>Tel: ${profesional.telefono}</li>
          <li>Dirección: ${profesional.direccion}</li>
        </ul>
      </div>
    `;
    contenidoContainer.appendChild(tarjetaProfesional);

    // Descripción profesional
    const descripcionProfesional = document.createElement('div');
    descripcionProfesional.classList.add('descripcionProfesional');
    descripcionProfesional.textContent = profesional.descripcion || 'Sin descripción disponible.';
    contenidoContainer.appendChild(descripcionProfesional);

    // Caja imágenes
    const cajaImagenes = document.createElement('div');
    cajaImagenes.classList.add('cajaImagenes');

    if (profesional.imagenes && profesional.imagenes.length > 0) {
      profesional.imagenes.forEach(imagen => {
        const img = document.createElement('img');
        img.src = imagen;
        img.alt = 'Imagen del profesional';
        cajaImagenes.appendChild(img);
      });
    } else {
      const sinImagenes = document.createElement('p');
      sinImagenes.textContent = 'Sin imágenes disponibles.';
      sinImagenes.classList.add('sinImagenesTexto'); // Para poder darle estilo si querés
      cajaImagenes.appendChild(sinImagenes);
    }
    contenidoContainer.appendChild(cajaImagenes);

// Caja valoraciones
const cajaValoraciones = document.createElement('div');
cajaValoraciones.classList.add('cajaValoraciones');

const tituloValoraciones = document.createElement('h3');
tituloValoraciones.textContent = 'Valoraciones';
cajaValoraciones.appendChild(tituloValoraciones);

// Contenedor grid para las cards de trabajos
const trabajosContainer = document.createElement('div');
trabajosContainer.id = 'trabajos-container';
cajaValoraciones.appendChild(trabajosContainer);

// Filtrar trabajos de este profesional
const trabajosProfesional = trabajos.filter(t => t.profesionalEmail === emailProfesional);

if (trabajosProfesional.length === 0) {
  const sinValoraciones = document.createElement('p');
  sinValoraciones.textContent = 'No hay trabajos contratados aún.';
  sinValoraciones.style.fontStyle = 'italic';
  cajaValoraciones.appendChild(sinValoraciones);
} else {
  trabajosProfesional.forEach(trabajo => {
    const cliente = usuarios.find(u => u.email === trabajo.usuarioEmail);
    const nombreCliente = cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Cliente desconocido';

    // Formatear la fecha
    const fecha = trabajo.fechaContratacion
      ? new Date(trabajo.fechaContratacion).toLocaleDateString('es-AR')
      : 'Fecha no disponible';

    const card = document.createElement('div');
    card.classList.add('trabajo-item');

    card.innerHTML = `
      <p><strong>Cliente:</strong> ${nombreCliente}</p>
      <p><strong>Rubro:</strong> ${trabajo.rubro || 'No especificado'}</p>
      <p><strong>Estado:</strong> ${trabajo.estado || 'Desconocido'}</p>
      <p><strong>Fecha de contratación:</strong> ${fecha}</p>
      <p><strong>Comentario:</strong> ${trabajo.comentario && trabajo.comentario.trim() !== '' ? trabajo.comentario : 'Aún no se comentó'}</p>
      <p><strong>Valoración:</strong> ${trabajo.valoracion !== null && trabajo.valoracion !== undefined ? trabajo.valoracion : 'Aún no se valoró'}</p>
    `;

    trabajosContainer.appendChild(card);
  });
}

contenidoContainer.appendChild(cajaValoraciones);

    // Contenedor botones conectar y contratar
    const conectarContainer = document.createElement('div');
    conectarContainer.classList.add('conectarContainer');

    // Label de disponibilidad
    const labelDisponible = document.createElement('label');
    labelDisponible.id = 'disponible';
    labelDisponible.textContent = profesional.estado ? 'Disponible' : 'No Disponible';
    labelDisponible.className = profesional.estado ? 'disponible' : 'no-disponible';
    conectarContainer.appendChild(labelDisponible);

    // Botón conectar
    const buttonConectar = document.createElement('button');
    buttonConectar.id = 'conectarProf';
    buttonConectar.textContent = 'Conectar';
    conectarContainer.appendChild(buttonConectar);

    // Botón contratar
    const buttonContratar = document.createElement('button');
    buttonContratar.id = 'contratarProf';
    buttonContratar.textContent = 'Contratar';
    buttonContratar.style.marginTop = '10px';
    buttonContratar.classList.add('btn', 'btn-primary');
    conectarContainer.appendChild(buttonContratar);

    contenidoContainer.appendChild(conectarContainer);

    // Eventos botones
    buttonConectar.addEventListener('click', () => {
      if (profesional.telefono) {
        abrirWhatsApp(profesional.telefono);
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Información',
          text: 'No hay teléfono disponible para este profesional.',
          confirmButtonColor: '#3b82f6'
        });
      }
    });

    buttonContratar.addEventListener('click', () => {
      contratarProfesional(emailProfesional);
    });

  })
  .catch(error => {
    console.error('Error cargando los JSON:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema cargando los datos. Intenta recargar la página.',
      confirmButtonColor: '#ef4444'
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  mostrarTarjetaProfesional();
});

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
  if (currentUser.tipo !== 'Cliente') {
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
  const numeroConPrefijo = telefono.startsWith('+') ? telefono : `+54${telefono}`;
  const url = `https://wa.me/${numeroConPrefijo.replace(/\D/g, '')}`;
  window.open(url, '_blank');
}