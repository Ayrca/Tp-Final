document.addEventListener('DOMContentLoaded', () => {
  const tipoUsuario = localStorage.getItem('tipoUsuario') || 'comun';
  const tituloForm = document.getElementById('form-titulo');
  const columnaProfesional = document.getElementById('columna-profesional');
  const btnAgregarRubro = document.getElementById('btn-agregar-rubro');
  const rubroContainer = document.getElementById('rubro-container');

  // Ajustar formulario según tipo de usuario
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

  actualizarCamposRubros();

  // Ocultar botón "X" del primer rubro
  const primerBtnEliminar = rubroContainer.querySelector('.rubro-item .btn-remove-rubro');
  if (primerBtnEliminar) {
    primerBtnEliminar.style.display = 'none';
  }

  // Función para agregar nuevo rubro
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

    const btnEliminar = nuevoRubro.querySelector('.btn-remove-rubro');
    btnEliminar.style.display = 'inline-block';
    btnEliminar.addEventListener('click', () => {
      nuevoRubro.remove();
    });

    ordenarOpciones(select);
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

  // Ordenar opciones de rubros alfabéticamente (excepto "Selecciona un rubro")
  function ordenarOpciones(select) {
    const opciones = Array.from(select.options).slice(1);
    opciones.sort((a, b) => a.text.localeCompare(b.text, 'es', { sensitivity: 'base' }));
    while (select.options.length > 1) {
      select.remove(1);
    }
    opciones.forEach(opcion => select.add(opcion));
  }

  document.querySelectorAll('select.rubro-select').forEach(select => {
    ordenarOpciones(select);
  });

  // Envío del formulario
  document.getElementById('registro-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmarPassword = document.getElementById('confirmar-password').value;
    const empresa = document.getElementById('empresa')?.value.trim() || '';
    const telefono = document.getElementById('telefono').value.trim();
    const direccion = document.getElementById('direccion').value.trim();


    if (password !== confirmarPassword) {
      Swal.fire('Las contraseñas no coinciden');
      return;
    }

    // Tomar rubros solo si es profesional
    const rubros = tipoUsuario === 'profesional'
      ? [...document.querySelectorAll('.rubro-select')].map(s => s.value)
      : [];

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