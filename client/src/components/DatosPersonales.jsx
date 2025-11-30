import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './estilos/DatosPersonales.css';

const BASE_URL = "https://tp-final-production.up.railway.app";

const DatosPersonales = ({
  usuario,
  editando,
  setEditando,
  handleGuardarCambios,
  handleCancelar,
}) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [oficios, setOficios] = useState([]);
  const [oficio, setOficio] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [descripcion, setDescripcion] = useState(usuario.descripcion);
  const [disponible, setDisponible] = useState(usuario.disponible);

  useEffect(() => {
    if (usuario) {
      console.log(usuario);
      setNombre(usuario.nombre);
      setApellido(usuario.apellido);
      setEmail(usuario.email);
      setTelefono(usuario.telefono);
      setDireccion(usuario.direccion);
      setOficio(usuario.oficio || '');
      setEmpresa(usuario.empresa || '');
      setDescripcion(usuario.descripcion);
        setDisponible(usuario.disponible);
    }
  }, [usuario]);
    useEffect(() => {
      const cargarOficios = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/oficios`);                        
          setOficios(response.data);
        } catch (error) {
          console.error(error);
        }
      };
      cargarOficios();
    }, []);
  const handleGuardar = () => {
    const datosActualizados = {
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      oficio,
      empresa,
      descripcion,
      disponible,
    };
    handleGuardarCambios(datosActualizados);
  };
  const handleNombreChange = (e) => {
    setNombre(e.target.value);
  };
  const handleApellidoChange = (e) => {
    setApellido(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleTelefonoChange = (e) => {
    setTelefono(e.target.value);
  };
  const handleDireccionChange = (e) => {
    setDireccion(e.target.value);
  };
  const handleOficioChange = (e) => {
    const oficioSeleccionado = oficios.find((oficio) => oficio.idOficios === parseInt(e.target.value));
    setOficio(oficioSeleccionado);
  };
  const handleEmpresaChange = (e) => {
    setEmpresa(e.target.value);
  };
  const handleDescripcionChange = (e) => {
    setDescripcion(e.target.value);
  };


  
return (
  <div>
    <p>
      <strong>Nombre: </strong>
      {editando ? (
        <input type="text" value={nombre} onChange={handleNombreChange} />
      ) : (
        <span>{nombre}</span>
      )}
    </p>
    <p>
      <strong>Apellido: </strong>
      {editando ? (
        <input type="text" value={apellido} onChange={handleApellidoChange} />
      ) : (
        <span>{apellido}</span>
      )}
    </p>
    <p>
      <strong>Email: </strong>
      {editando ? (
        <input type="email" value={email} onChange={handleEmailChange} />
      ) : (
        <span>{email}</span>
      )}
    </p>
    <p>
      <strong>Teléfono: </strong>
      {editando ? (
        <input type="tel" value={telefono} onChange={handleTelefonoChange} />
      ) : (
        <span>{telefono}</span>
      )}
    </p>
    <p>
      <strong>Dirección: </strong>
      {editando ? (
        <input type="text" value={direccion} onChange={handleDireccionChange} />
      ) : (
        <span>{direccion}</span>
      )}
    </p>
    {usuario.tipo === 'profesional' && (
      <>
        <p>
          <strong>Oficio: </strong>
          {editando ? (
            <select value={oficio.idOficios} onChange={handleOficioChange}>
              {oficios.map((oficio) => (
                <option key={oficio.idOficios} value={oficio.idOficios}>
                  {oficio.nombre}
                </option>
              ))}
            </select>
          ) : (
            <span>{oficio.nombre}</span>
          )}
        </p>

        <p>
  <strong>Disponibilidad: </strong>
  {editando ? (
    <button
      type="button"
      className={`btn ${disponible ? 'btn-success' : 'btn-danger'}`}
      onClick={() => setDisponible(!disponible)}
    >
      {disponible ? 'Disponible' : 'No disponible'}
    </button>
  ) : (
    <span style={{ color: disponible ? 'green' : 'red' }}>
      {disponible ? 'Disponible' : 'No disponible'}
    </span>
  )}
</p>

          <p>
          <strong>Empresa: </strong>
          {editando ? (
            <input type="text" value={empresa} onChange={handleEmpresaChange} />
          ) : (
            <span>{empresa}</span>
          )}
        </p>
        <p>
          <strong>Descripción de habilidades, conocimientos y trabajos anteriores: </strong>
          {editando ? (
            <input type="text" value={descripcion} onChange={handleDescripcionChange} />
          ) : (
            <span>{usuario.descripcion}</span>
          )}
        </p>
      </>
    )}
    {editando ? (
      <div>
        <button onClick={handleGuardar}>✔️ Guardar cambios</button>
        <button onClick={handleCancelar}>❌ Cancelar</button>
      </div>
    ) : (
      <button onClick={() => setEditando(true)}>✏️ Modificar datos</button>
    )}
  </div>
);

};
export default DatosPersonales;