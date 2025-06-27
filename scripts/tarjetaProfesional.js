
function mostrarTarjetaProfesional() {
  // Obtener el email del profesional seleccionado desde localStorage
  const emailProfesional = localStorage.getItem('emailProfesional');

  // Cargar los datos del JSON
  fetch('../datos/usuarios.json')
    .then(response => response.json())
    .then(data => {
      const profesional = data.find(p => p.email === emailProfesional);

      if (profesional) {
        const mainContainer = document.querySelector('main.containerProfesional');

        // Crear la tarjeta del profesional
        const tarjetaProfesional = document.createElement('div');
        tarjetaProfesional.classList.add('tarjetaProfesional');
        tarjetaProfesional.innerHTML = `
          <img src="${profesional.avatar}" alt="Foto del profesional">
          <div class="datosProfesional">
            <ul>
              <li>Rubros: ${profesional.rubros}</li>
              <li>${profesional.nombre} ${profesional.apellido}.</li>
              <li>${profesional.empresa}.</li>
              <li>Email: ${profesional.email}</li>
              <li>Tel: ${profesional.telefono}</li>
              <li>Dirección: ${profesional.direccion}</li>
            </ul>
          </div>
        `;
        mainContainer.appendChild(tarjetaProfesional);

        // Crear la descripción del profesional
        const descripcionProfesional = document.createElement('div');
        descripcionProfesional.classList.add('descripcionProfesional');
        descripcionProfesional.textContent = profesional.descripcion;
        mainContainer.appendChild(descripcionProfesional);

        // Crear la caja de imágenes
        const cajaImagenes = document.createElement('div');
        cajaImagenes.classList.add('cajaImagenes');
        profesional.imagenes.forEach(imagen => {
          const img = document.createElement('img');
          img.src = imagen;
          img.alt = 'Imagen del profesional';
          cajaImagenes.appendChild(img);
        });
        mainContainer.appendChild(cajaImagenes);

        // Crear la valuación
        const valuacion = document.createElement('h2');
        valuacion.textContent = `Valuación: ${profesional.valuacion}`;
        mainContainer.appendChild(valuacion);

        // Crear la caja de comentarios
        const cajaComentario = document.createElement('div');
        cajaComentario.classList.add('cajaComentario');
        profesional.comentarios.forEach(comentario => {
          const p = document.createElement('p');
          p.textContent = comentario;
          cajaComentario.appendChild(p);
        });
        mainContainer.appendChild(cajaComentario);

        // Crear el botón de conectar
        const conectarContainer = document.createElement('div');
        conectarContainer.classList.add('conectarContainer');
        const labelDisponible = document.createElement('label');
        labelDisponible.id = 'disponible';
        labelDisponible.textContent = profesional.estado ? 'Disponible' : 'No Disponible';
        labelDisponible.className = profesional.estado ? 'disponible' : 'no-disponible';
        conectarContainer.appendChild(labelDisponible);
        const buttonConectar = document.createElement('button');
        buttonConectar.id = 'conectarProf';
        buttonConectar.textContent = 'Conectar';
        conectarContainer.appendChild(buttonConectar);
        mainContainer.appendChild(conectarContainer);
      } else {
        console.error('No se encontró el profesional');
      }
    })
    .catch(error => console.error('Error cargando el JSON:', error));
}


document.addEventListener('DOMContentLoaded', () => {
  mostrarTarjetaProfesional();
});