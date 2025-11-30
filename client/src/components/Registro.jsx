import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './estilos/Registro.css';
import Swal from 'sweetalert2';

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
  mostrarContraseña,
  setMostrarContraseña,
  mostrarConfirmarContraseña,
  setMostrarConfirmarContraseña,
}) => (
  <div className="form-columns">
    <div className="column" id="columna-izquierda">

      <label htmlFor="nombre">Nombre:</label>
      <input
        type="text"
        id="nombre"
        placeholder="Escribe tu nombre"
        required
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <label htmlFor="apellido">Apellido:</label>
      <input
        type="text"
        id="apellido"
        placeholder="Escribe tu apellido"
        required
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
      />

      <label htmlFor="fecha-nacimiento">Fecha de nacimiento:</label>
      <input
        type="date"
        id="fecha-nacimiento"
        required
        value={fechaNacimiento}
        onChange={(e) => setFechaNacimiento(e.target.value)}
        min="1900-01-01"
        max={new Date().toISOString().split("T")[0]}
      />

      <label htmlFor="telefono">Teléfono:</label>
      <input
        type="tel"
        id="telefono"
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
        placeholder="Escribe tu email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label htmlFor="direccion">Dirección:</label>
      <input
        type="text"
        id="direccion"
        placeholder="Ej: Av. Colon 1520"
        required
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
      />

      {/* === CONTRASEÑA === */}
      <label htmlFor="password">Contraseña:</label>
      <div className="password-wrapper">
        <input
          type={mostrarContraseña ? "text" : "password"}
          id="password"
          placeholder="Escribe una contraseña"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="button"
          className="toggle-pre-registro"
          onClick={() => setMostrarContraseña(!mostrarContraseña)}
        >
          <img
            src={
              mostrarContraseña
                ? "../assets/images/eye-open.png"
                : "../assets/images/eye-closed.png"
            }
            alt="Mostrar contraseña"
          />
        </button>
      </div>

      {/* === CONFIRMAR CONTRASEÑA === */}
      <label htmlFor="confirmar-password">Confirmar contraseña:</label>
      <div className="password-wrapper">
        <input
          type={mostrarConfirmarContraseña ? "text" : "password"}
          id="confirmar-password"
          placeholder="Confirmar contraseña"
          required
          value={confirmarPassword}
          onChange={(e) => setConfirmarPassword(e.target.value)}
        />

        <button
          type="button"
          className="toggle-pre-registro"
          onClick={() =>
            setMostrarConfirmarContraseña(!mostrarConfirmarContraseña)
          }
        >
          <img
            src={
              mostrarConfirmarContraseña
                ? "../assets/images/eye-open.png"
                : "../assets/images/eye-closed.png"
            }
            alt="Mostrar contraseña"
          />
        </button>
      </div>

    </div>
  </div>
);

const Registro = () => {  

  const [oficiosOptions, setOficiosOptions] = useState([]);

  // Un solo oficio
  const [oficioSeleccionado, setOficioSeleccionado] = useState("");

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

  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [mostrarConfirmarContraseña, setMostrarConfirmarContraseña] = useState(false);

  useEffect(() => {
    const tipo = localStorage.getItem('tipoUsuario');
    setTipoUsuario(tipo);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/usuario/verificar-email', { email });

      if (response.data.mensaje === 'El email está disponible') {

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
          empresa: tipoUsuario === 'profesional' ? empresa : null,
          rubros: tipoUsuario === 'profesional' ? [{ id: oficioSeleccionado }] : null,
          disponible: true,
        };

        const endpoint =
          tipoUsuario === 'Cliente'
            ? 'http://localhost:3000/usuario/registro'
            : 'http://localhost:3000/profesional/registro';

        await axios.post(endpoint, datos);

        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'Tu cuenta ha sido creada con éxito.',
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          window.location.href = '/';
        });

      }
    } catch (error) {
      if (error.response?.status === 400) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response.data.message,
        });
      }
    }
  };

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
          mostrarContraseña={mostrarContraseña}
          setMostrarContraseña={setMostrarContraseña}
          mostrarConfirmarContraseña={mostrarConfirmarContraseña}
          setMostrarConfirmarContraseña={setMostrarConfirmarContraseña}
        />

        {tipoUsuario === 'profesional' && (
          <div className="form-tercera-columna" id="columna-profesional">

            <label>Oficio:</label>
            <select
              className="oficio-select"
              required
              value={oficioSeleccionado}
              onChange={(e) => setOficioSeleccionado(e.target.value)}
            >
              <option value="">Selecciona un oficio</option>
              {oficiosOptions.map((oficio) => (
                <option key={oficio.idOficios} value={oficio.idOficios}>
                  {oficio.nombre}
                </option>
              ))}
            </select>

            <label htmlFor="empresa">Empresa (opcional):</label>
            <input
              type="text"
              id="empresa"
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