
function mostrarTarjetaProfesional() {
  // Obtener el índice del profesional seleccionado desde localStorage

  const indexProfesional = localStorage.getItem('idProfesional');
  const categoria = localStorage.getItem('categoria');

  // Cargar los datos del JSON
  fetch('../datos/datos.json')
    .then(response => response.json())
    .then(data => {

      const profesionales = data[categoria];
      const profesional = profesionales[indexProfesional];

      // Crear la tarjeta del profesional
      const tarjetaProfesional = document.querySelector('.tarjetaProfesional');
      tarjetaProfesional.innerHTML = `
        <img src="${profesional.imagen}" alt="Foto del profesional">
        <div class="datosProfesional">
          <ul>
            <li>${categoria}</li>
            <li>${profesional.nombre} ${profesional.apellido}</li>
            <li>${profesional.email}</li>
            <li>${profesional.direccion}</li>
          </ul>
        </div>
      `;
    })
    .catch(error => console.error('Error cargando el JSON:', error));
}


document.addEventListener('DOMContentLoaded', () => {
  mostrarTarjetaProfesional();
});