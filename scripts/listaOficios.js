fetch('../datos/datos.json')
  .then(response => response.json())
  .then(data => {
    //ordena los oficios alfabeticamente
    data.oficios.sort((a, b) => a.nombre.localeCompare(b.nombre));
    const oficiosDiv = document.getElementById('listaOficios');

    data.oficios.forEach(oficio => {
      const oficioHTML = `
        <div data-categoria="${oficio.nombre}" class="oficio-card">
          <p>${oficio.nombre}</p>
        </div>
      `;
      oficiosDiv.insertAdjacentHTML('beforeend', oficioHTML);
    });
/*
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
  */

    // Eventos de click
    document.querySelectorAll('.oficio-card').forEach(item => {
      item.addEventListener('click', () => {
        const categoria = item.getAttribute('data-categoria');
        localStorage.setItem('categoria', categoria);
        window.location.href = '/pages/listaProfesionales.html';
      });
    });
  })
  .catch(error => console.error('Error cargando el JSON:', error));