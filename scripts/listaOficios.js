fetch('../datos/datos.json')
  .then(response => response.json())
  .then(data => {
    data.oficios.sort((a, b) => a.nombre.localeCompare(b.nombre));
    const oficiosDiv = document.getElementById('listaOficios');

    data.oficios.forEach(oficio => {
      const oficioHTML = `
        <div data-categoria="${oficio.nombre}" class="oficio-item">
          <p>${oficio.nombre}</p>
        </div>
      `;
      oficiosDiv.innerHTML += oficioHTML;
    });

    const oficioItems = document.querySelectorAll('.oficio-item');
    oficioItems.forEach(item => {
      item.addEventListener('click', () => {
        const categoria = item.getAttribute('data-categoria');
        localStorage.setItem('categoria', categoria);
        window.location.href = '/pages/listaProfesionales.html';
      });
    });
  })
  .catch(error => console.error('Error cargando el JSON:', error));