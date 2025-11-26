
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './estilos/PerfilComercial.css'; // Importa el archivo CSS
const PerfilComercial = () => {
  const location = useLocation();
  const profesional = location.state?.profesional;
  const [imagenes, setImagenes] = useState([]);
  const [trabajos, setTrabajos] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (profesional) {
      axios.get(`http://localhost:3000/imagen/${profesional.idusuarioProfesional}`)                                                          
        .then((response) => {
          setImagenes(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
      axios.get(`http://localhost:3000/trabajoContratado/${profesional.idusuarioProfesional}`)
        .then((response) => {
          if (Array.isArray(response.data)) {
            setTrabajos(response.data);
          } else {
            setError('La respuesta de la API no es un array');
          }
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  }, [profesional]);
  if (!profesional) {
    return <div>No se encontró el perfil</div>;
  }
  return (
    <div>
      {profesional.avatar ? (
  <img src={profesional.avatar} alt="Avatar" className="avatar-img1" />
) : (
  <p className="no-imagen">No hay imagen disponible</p>
)}
    
      <h2>{profesional.empresa}.</h2>
      <p>Nombre: {profesional.nombre}</p>
      <p>Apellido: {profesional.apellido}</p>
      <p>Email: {profesional.email}</p>
      <p>Tel: {profesional.telefono}</p>
      <p>Dirección: {profesional.direccion}</p>
      <p>Valoración promedio: {profesional.valoracion}</p>
      <p>Descripcion: {profesional.descripcion}</p>
      <div className="imagenes-container">
        {imagenes.length > 0 ? (
          imagenes.map((imagen, index) => (
            <img key={index} src={imagen.url} alt="Imagen" />
          ))
        ) : (
          <p>No hay imágenes disponibles</p>
        )}
      </div>
      <h3>Trabajos anteriores</h3>
      <div className="trabajos-realizados">
        {Array.isArray(trabajos) && trabajos.length > 0 ? (
          trabajos.map((trabajo) => (
            <div key={trabajo.idcontratacion} className="tarjeta-trabajo">
              <p><span>Trabajo Rubro: </span><span className="dato">{trabajo.rubro}</span></p>
              <p><span>Estado: </span> <span className="dato">{trabajo.estado}</span></p>
              <p><span>Fecha de contratación: </span> <span className="dato">{trabajo.fechaContratacion}</span></p>
              <p><span>Cliente: </span> <span className="dato">{trabajo.usuarioComun.nombre} {trabajo.usuarioComun.apellido}</span></p>
              <p><span>Comentario:</span> <span className="dato">{trabajo.comentario}</span></p>
              <p><span>Valoración:</span> <span className="dato">{trabajo.valoracion}</span></p>
            </div>
          ))
        ) : (
          <p>Este usuario no tiene trabajos realizados por el momento</p>
        )}
        {error && <p>Error: {error}</p>}
      </div>
    </div>
  );
};
export default PerfilComercial;