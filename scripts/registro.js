document.addEventListener('DOMContentLoaded', async () => {

  const tipoUsuario = localStorage.getItem('tipoUsuario') || 'Cliente';
  const tituloForm = document.getElementById('form-titulo');
  const columnaProfesional = document.getElementById('columna-profesional');
  const btnAgregarRubro = document.getElementById('btn-agregar-rubro');
  const rubroContainer = document.getElementById('rubro-container');

  let listaRubrosDisponibles = [];

  //Cargar rubros desde datos.json
  async function cargarRubros() {
    try {
      const response = await fetch('/datos/datos.json');
      if (!response.ok) throw new Error('Error al cargar datos.json');
      const data = await response.json();
      listaRubrosDisponibles = data.oficios.map(oficio => oficio.nombre);
    } catch (error) {
      console.error('Error al cargar rubros:', error);
      Swal.fire('Error al cargar la lista de rubros');
    }
  }

  //Poblar un <select> con las opciones
  function poblarOpcionesRubro(select) {
    // Limpiar y agregar opción inicial
    select.innerHTML = '<option value="">Selecciona un rubro</option>';
    // Agregar todas las opciones ordenadas alfabéticamente
    listaRubrosDisponibles
      .sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }))
      .forEach(rubro => {
        const option = document.createElement('option');
        option.value = rubro.toLowerCase().replace(/\s+/g, '-');
        option.textContent = rubro;
        select.appendChild(option);
      });
  }

  //Inicialización de la página
  await cargarRubros();

  actualizarCamposRubros();

  // Al cargar, poblar el primer select
  const primerSelect = rubroContainer.querySelector('.rubro-select');
  if (primerSelect) {
    poblarOpcionesRubro(primerSelect);
  }

  //Ajustar visibilidad según tipo de usuario
  function actualizarCamposRubros() {
    if (tipoUsuario === 'profesional') {
      tituloForm.textContent = 'Registro de Profesional';
      columnaProfesional.style.display = 'block';
      rubroContainer.querySelectorAll('select.rubro-select').forEach(select => {
        select.required = true;
        select.disabled = false;
      });
      btnAgregarRubro.style.display = 'inline-block';
    } else {
      tituloForm.textContent = 'Registro de Usuario';
      columnaProfesional.style.display = 'none';
      rubroContainer.querySelectorAll('select.rubro-select').forEach(select => {
        select.required = false;
        select.disabled = true;
      });
      btnAgregarRubro.style.display = 'none';
    }
  }

  //Ocultar botón "X" del primer rubro
  const primerBtnEliminar = rubroContainer.querySelector('.rubro-item .btn-remove-rubro');
  if (primerBtnEliminar) {
    primerBtnEliminar.style.display = 'none';
  }

  //Función para agregar nuevo rubro
  function agregarRubro() {
    const actuales = rubroContainer.querySelectorAll('.rubro-item').length;
    if (actuales >= 4) {
      Swal.fire('Máximo de 4 rubros permitidos');
      return;
    }

    const primerRubro = rubroContainer.querySelector('.rubro-item');
    const nuevoRubro = primerRubro.cloneNode(true);

    const select = nuevoRubro.querySelector('select');
    select.value = '';
    select.required = true;
    select.disabled = false;

    poblarOpcionesRubro(select);

    const btnEliminar = nuevoRubro.querySelector('.btn-remove-rubro');
    btnEliminar.style.display = 'inline-block';
    btnEliminar.addEventListener('click', () => {
      nuevoRubro.remove();
    });

    rubroContainer.appendChild(nuevoRubro);
  }

  btnAgregarRubro.addEventListener('click', agregarRubro);

  // Eliminar rubros con botón X
  rubroContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-remove-rubro')) {
      const item = e.target.closest('.rubro-item');
      if (item && rubroContainer.querySelectorAll('.rubro-item').length > 1) {
        item.remove();
      }
    }
  });

  // Mostrar/ocultar contraseña
  document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', () => {
      const inputId = icon.dataset.target;
      const input = document.getElementById(inputId);
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      }
    });
  });

  //Envío del formulario
  document.getElementById('registro-form').addEventListener('submit', async (e) => {
    e.preventDefault();

      // Obtiene valores de todos los campos
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmarPassword = document.getElementById('confirmar-password').value;
    const empresa = document.getElementById('empresa')?.value.trim() || '';
    const telefono = document.getElementById('telefono').value.trim();
    const direccion = document.getElementById('direccion').value.trim();

      // Validación: contraseña y confirmación iguales
    if (password !== confirmarPassword) {
      Swal.fire('Las contraseñas no coinciden');
      return;
    }

      // Si es profesional, obtiene los rubros seleccionados
    const rubros = tipoUsuario === 'profesional'
      ? [...document.querySelectorAll('.rubro-select')].map(s => s.value)
      : [];

        // Arma el objeto con los datos del nuevo usuario
    const nuevoUsuario = {
      nombre,
      apellido,
      email,
      password,
      tipo: tipoUsuario,
      rubros,
      empresa: tipoUsuario === 'profesional' ? empresa : '',
      telefono,
      direccion,
      estadoCuenta: true
    };

      // Enviar al backend
    try {
      const response = await fetch('http://localhost:3000/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoUsuario)
      });

      const data = await response.json();

      if (!response.ok) {
        Swal.fire(data.error || 'Error en el registro');
        return;
      }

      Swal.fire('Registro exitoso').then(() => {
        window.location.href = '../index.html';
      });

    } catch (error) {
      Swal.fire('Error de conexión');
      console.error(error);
    }
  });

});