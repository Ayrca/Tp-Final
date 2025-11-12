
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './estilos/Registro.css';


const CamposComunes = ({
  nombre,
  apellido,
  fechaNacimiento,
  telefono,
  email,
  direccion,
  password,
  confirmarPassword,
  setNombre,
  setApellido,
  setFechaNacimiento,
  setTelefono,
  setEmail,
  setDireccion,
  setPassword,
  setConfirmarPassword,
}) => (
  <div className="form-columns">
    <div className="column" id="columna-izquierda">
      <label htmlFor="nombre">Nombre:</label>
      <input
        type="text"
        id="nombre"
        name="nombre"
        placeholder="Escribe tu nombre"
        required
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <label htmlFor="apellido">Apellido:</label>
      <input
        type="text"
        id="apellido"
        name="apellido"
        placeholder="Escribe tu apellido"
        required
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
      />
      <label htmlFor="fecha-nacimiento">Fecha de Nacimiento:</label>
      <input
        type="date"
        id="fecha-nacimiento"
        name="fecha-nacimiento"
        required
        value={fechaNacimiento}
        onChange={(e) => setFechaNacimiento(e.target.value)}
        min="1900-01-01"
        max={new Date().toISOString().split('T')[0]}
      />
      <label htmlFor="telefono">Teléfono:</label>
      <input
        type="tel"
        id="telefono"
        name="telefono"
        placeholder="Ej: 2284555555"
        pattern="[0-9]+"
        title="Solo números"
        required
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />
    </div>
    <div className="column" id="columna-derecha">
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        name="email"
        placeholder="Escribe tu email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="direccion">Dirección:</label>
      <input
        type="text"
        id="direccion"
        name="direccion"
        placeholder="Ej: Av. Colon 1520"
        required
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
      />
      <label htmlFor="password">Contraseña:</label>
      <div className="password-container">
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Escribe una contraseña"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <i className="fas fa-eye-slash toggle-password" data-target="password"></i>
      </div>
      <label htmlFor="confirmar-password">Confirmar Contraseña:</label>
      <div className="password-container">
        <input
          type="password"
          id="confirmar-password"
          name="confirmar-password"
          placeholder="Confirmar contraseña"
          required
          value={confirmarPassword}
          onChange={(e) => setConfirmarPassword(e.target.value)}
        />
        <i className="fas fa-eye-slash toggle-password" data-target="confirmar-password"></i>
      </div>
    </div>
  </div>
);
const Registro = () => {


const [oficiosOptions, setOficiosOptions] = useState([]);
const [oficioSeleccionado, setOficioSeleccionado] = useState('');
useEffect(() => {
  const obtenerOficios = async () => {
    try {
      const response = await axios.get('http://localhost:3000/oficios');                        
      setOficiosOptions(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  obtenerOficios();
}, []);


  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [rubros, setRubros] = useState([]);

  useEffect(() => {
    const tipo = localStorage.getItem('tipoUsuario');
    setTipoUsuario(tipo);
  }, []);

const handleSubmit = async (e) => {
  e.preventDefault();
  // Validar nombre y apellido
  if (!/^[a-zA-Z ]+$/.test(nombre) || !/^[a-zA-Z ]+$/.test(apellido)) {
    alert('El nombre y el apellido solo pueden contener letras y espacios');
    return;
  }
  // Validar fecha de nacimiento
  const fechaNacimientoDate = new Date(fechaNacimiento);
  const hoy = new Date();
  const edad = hoy.getFullYear() - fechaNacimientoDate.getFullYear();
  if (edad < 18) {
    alert('Debes tener al menos 18 años para registrarte');
    return;
  }
  // Validar teléfono
  if (!/^[0-9]+$/.test(telefono)) {
    alert('El teléfono solo puede contener números');
    return;
  }
  // Validar email
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    alert('El email no es válido');
    return;
  }
  // Validar contraseña
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)) {
    alert('La contraseña debe tener al menos 8 caracteres, una letra capital, una letra pequeña, un número y un carácter especial');
    return;
  }
  // Validar confirmación de contraseña
  if (password !== confirmarPassword) {
    alert('Las contraseñas no coinciden');
    return;
  }
  // Si todas las validaciones pasan, enviar el formulario
  const datos = {
    nombre,
    apellido,
    fechaNacimiento: new Date(fechaNacimiento),
    telefono,
    email,
    direccion,
    password,
    estadoCuenta: true,
    avatar: '',
    tipo: tipoUsuario,
    oficio: oficioSeleccionado,
    empresa: tipoUsuario === 'profesional' ? empresa : null,
    rubros: tipoUsuario === 'profesional' ? rubros : null,
  };
  
try {
      if (tipoUsuario === 'Cliente') {
        const response = await axios.post('http://localhost:3000/usuario/registro', datos);                                         
        console.log(response.data);
      } else {
        const response = await axios.post('http://localhost:3000/profesional/registro', datos);
        console.log(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };



/*
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmarPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    const datos = {
      nombre,
      apellido,
      fechaNacimiento: new Date(fechaNacimiento),
      telefono,
      email,
      direccion,
      password,
      estadoCuenta: true,
      avatar: '',
      tipo: tipoUsuario,
      oficio: oficioSeleccionado,
      empresa: tipoUsuario === 'profesional' ? empresa : null,
      rubros: tipoUsuario === 'profesional' ? rubros : null,
    };

    try {
      if (tipoUsuario === 'Cliente') {
        const response = await axios.post('http://localhost:3000/usuario/registro', datos);                                         
        console.log(response.data);
      } else {
        const response = await axios.post('http://localhost:3000/profesional/registro', datos);
        console.log(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
*/


  return (
    <div>
      <form id="registro-form" onSubmit={handleSubmit}>
        <h2 id="form-titulo">Registro de {tipoUsuario === 'Cliente' ? 'Usuario' : 'Profesional'}</h2>
        <CamposComunes
          nombre={nombre}
          apellido={apellido}
          fechaNacimiento={fechaNacimiento}
          telefono={telefono}
          email={email}
          direccion={direccion}
          password={password}
          confirmarPassword={confirmarPassword}
          setNombre={setNombre}
          setApellido={setApellido}
          setFechaNacimiento={setFechaNacimiento}
          setTelefono={setTelefono}
          setEmail={setEmail}
          setDireccion={setDireccion}
          setPassword={setPassword}
          setConfirmarPassword={setConfirmarPassword}
        />
        {tipoUsuario === 'profesional' && (
<div className="form-tercera-columna" id="columna-profesional">

<div id="rubro-container">
  <div className="rubro-item">
<select name="oficios" className="oficio-select" required value={oficioSeleccionado} onChange={(e) => setOficioSeleccionado(e.target.value)}>
  <option value="">Selecciona un oficio</option>
  {oficiosOptions.map((oficio) => (
    <option key={oficio.idOficios} value={oficio.idOficios}>{oficio.nombre}</option>
  ))}
</select>
    <button type="button" className="btn-remove-rubro" title="Eliminar rubro">
      ×
    </button>
  </div>
</div>

            <button type="button" id="btn-agregar-rubro">
              + Agregar otro rubro
            </button>
            <label htmlFor="empresa">Empresa (opcional):</label>
            <input
              type="text"
              id="empresa"
              name="empresa"
              placeholder="Nombre de tu empresa"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
            />
          </div>
        )}
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};
export default Registro;