fetch('../datos/datos.json')
  .then(response => response.json())
  .then(data => {
    // Ordenar la lista de oficios alfabéticamente
    data.oficios.sort((a, b) => a.nombre.localeCompare(b.nombre));

    // Seleccionar el elemento donde se mostrarán los oficios
    const oficiosDiv = document.getElementById('listaOficios');

    // Crear una lista de oficios
    data.oficios.forEach(oficio => {
      const oficioHTML = `
        <div>
          <p>${oficio.nombre}</p>
        </div>
      `;
      oficiosDiv.innerHTML += oficioHTML;
    });
  })
  .catch(error => console.error('Error cargando el JSON:', error));