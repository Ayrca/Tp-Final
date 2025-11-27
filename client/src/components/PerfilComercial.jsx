import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './estilos/PerfilComercial.css';

const PerfilComercial = () => {
  const location = useLocation();
  const profesional = location.state?.profesional;

  const [imagenes, setImagenes] = useState([]);
  const [trabajos, setTrabajos] = useState([]);
  const [error, setError] = useState(null);

  // GALERÍA
  const [galeriaPagina, setGaleriaPagina] = useState(1);
  const [fadeGaleria, setFadeGaleria] = useState("fade-in");
  const imagenesPorPagina = 9;

  // TRABAJOS
  const [paginaActual, setPaginaActual] = useState(1);
  const [fadeTrabajos, setFadeTrabajos] = useState("fade-in");
  const trabajosPorPagina = 9;

  useEffect(() => {
    if (profesional) {
      axios
        .get(`http://localhost:3000/imagen/${profesional.idusuarioProfesional}`)
        .then((response) => {
          if (Array.isArray(response.data)) setImagenes(response.data);
        })
        .catch(() => {});

      axios
        .get(`http://localhost:3000/trabajoContratado/${profesional.idusuarioProfesional}`)
        .then((response) => {
          if (Array.isArray(response.data)) setTrabajos(response.data);
          else setError("La respuesta de la API no es un array");
        })
        .catch((error) => setError(error.message));
    }
  }, [profesional]);

  if (!profesional) return <div>No se encontró el perfil</div>;

  // Helper para renderizar estrellas
  const renderEstrellas = (valoracion) => {
    const maxEstrellas = 5;
    const estrellas = [];
    for (let i = 1; i <= maxEstrellas; i++) {
      estrellas.push(
        <span key={i} className={i <= valoracion ? "estrella llena" : "estrella vacia"}>
          {i <= valoracion ? "★" : "☆"}
        </span>
      );
    }
    return estrellas;
  };

  // CALCULO GALERÍA
  const totalPaginasGaleria = Math.ceil(imagenes.length / imagenesPorPagina);
  const inicioGaleria = (galeriaPagina - 1) * imagenesPorPagina;
  const imagenesPagina = imagenes.slice(inicioGaleria, inicioGaleria + imagenesPorPagina);

  const cambiarPaginaGaleria = (nueva) => {
    setFadeGaleria("fade-out");
    setTimeout(() => {
      setGaleriaPagina(nueva);
      setFadeGaleria("fade-in");
    }, 300);
  };

  // CALCULO TRABAJOS
  const totalPaginasTrabajos = Math.ceil(trabajos.length / trabajosPorPagina);
  const inicioTrabajos = (paginaActual - 1) * trabajosPorPagina;
  const trabajosPagina = trabajos.slice(inicioTrabajos, inicioTrabajos + trabajosPorPagina);

  const cambiarPaginaTrabajos = (nueva) => {
    setFadeTrabajos("fade-out");
    setTimeout(() => {
      setPaginaActual(nueva);
      setFadeTrabajos("fade-in");
    }, 300);
  };

  return (
    <div className="perfil-container">

      {/* HEADER */}
      <div className="perfil-header">
        {profesional.avatar ? (
          <img src={profesional.avatar} alt="Avatar" className="avatar-comercial" />
        ) : (
          <div className="avatar-placeholder-comercial">Sin imagen</div>
        )}

        <div className="perfil-info">
          <h2>{profesional.empresa}</h2>
          <p><strong>Nombre:</strong> {profesional.nombre} {profesional.apellido}</p>
          <p><strong>Email:</strong> {profesional.email}</p>
          <p><strong>Tel:</strong> {profesional.telefono}</p>
          <p><strong>Dirección:</strong> {profesional.direccion}</p>
          <p><strong>Valoración promedio:</strong> {renderEstrellas(profesional.valoracion)}</p>
          <p className="descripcion">{profesional.descripcion}</p>
        </div>
      </div>

      {/* GALERÍA */}
      <h3>Galería de trabajos</h3>

      <div className={`imagenes-comercial-container gallery-grid ${fadeGaleria}`}>
        {imagenesPagina.length > 0 ? (
          imagenesPagina.map((img, i) => (
            <img key={i} src={img.url} alt="" className="gallery-img" />
          ))
        ) : (
          <p>No hay imágenes disponibles</p>
        )}
      </div>

      {/* PAGINACIÓN GALERÍA */}
      {totalPaginasGaleria > 1 && (
        <div className="gallery-pagination">
          <button
            className="pag-btn"
            disabled={galeriaPagina === 1}
            onClick={() => cambiarPaginaGaleria(galeriaPagina - 1)}
          >
            ◀
          </button>

          <span className="pag-indicator">
            {galeriaPagina} / {totalPaginasGaleria}
          </span>

          <button
            className="pag-btn"
            disabled={galeriaPagina === totalPaginasGaleria}
            onClick={() => cambiarPaginaGaleria(galeriaPagina + 1)}
          >
            ▶
          </button>
        </div>
      )}

      {/* TRABAJOS */}
      <h3>Trabajos realizados</h3>

      <div className={`trabajos-grid gallery-grid ${fadeTrabajos}`}>
        {trabajosPagina.length > 0 ? (
          trabajosPagina.map((trabajo) => (
            <div key={trabajo.idcontratacion} className="tarjeta-trabajo">
              <h4>{trabajo.rubro}</h4>
              <p><strong>Estado:</strong> {trabajo.estado}</p>
              <p><strong>Fecha:</strong> {trabajo.fechaContratacion}</p>
              <p><strong>Cliente:</strong> {trabajo.usuarioComun.nombre} {trabajo.usuarioComun.apellido}</p>
              <p><strong>Comentario:</strong> {trabajo.comentario}</p>
              <p><strong>Valoración:</strong> {renderEstrellas(trabajo.valoracion)}</p>
            </div>
          ))
        ) : (
          <p>Este profesional no tiene trabajos realizados</p>
        )}
      </div>

      {/* PAGINACION TRABAJOS */}
      {totalPaginasTrabajos > 1 && (
        <div className="gallery-pagination">
          <button
            className="pag-btn"
            disabled={paginaActual === 1}
            onClick={() => cambiarPaginaTrabajos(paginaActual - 1)}
          >
            ◀
          </button>

          <span className="pag-indicator">
            {paginaActual} / {totalPaginasTrabajos}
          </span>

          <button
            className="pag-btn"
            disabled={paginaActual === totalPaginasTrabajos}
            onClick={() => cambiarPaginaTrabajos(paginaActual + 1)}
          >
            ▶
          </button>
        </div>
      )}

      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default PerfilComercial;