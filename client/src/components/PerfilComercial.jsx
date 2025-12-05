import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './estilos/PerfilComercial.css';
import Swal from 'sweetalert2';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const CLOUDINARY_URL = 'https://res.cloudinary.com/ddadtpm2o/image/upload/';

const PerfilComercial = () => {
  const location = useLocation();
  const profesional = location.state?.profesional;

  const [imagenes, setImagenes] = useState([]);
  const [trabajos, setTrabajos] = useState([]);
  const [valoracionPromedio, setValoracionPromedio] = useState(0);
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
      // Traer imágenes
      axios.get(`${BASE_URL}/imagen/${profesional.idusuarioProfesional}`)
        .then((response) => {
          if (Array.isArray(response.data)) setImagenes(response.data);
        })
        .catch(() => {});

      // Traer trabajos
      axios.get(`${BASE_URL}/trabajoContratado/${profesional.idusuarioProfesional}`)
        .then((response) => {
          if (Array.isArray(response.data)) {
            const trabajosOrdenados = response.data.sort(
              (a, b) => new Date(b.fechaContratacion) - new Date(a.fechaContratacion)
            );
            setTrabajos(trabajosOrdenados);

            const trabajosValorados = trabajosOrdenados.filter(t => t.valoracion && t.valoracion > 0);
            if (trabajosValorados.length > 0) {
              const suma = trabajosValorados.reduce((acc, t) => acc + t.valoracion, 0);
              setValoracionPromedio(suma / trabajosValorados.length);
            } else {
              setValoracionPromedio(0);
            }
          } else setError("La respuesta de la API no es un array");
        })
        .catch((error) => setError(error.message));
    }
  }, [profesional]);

  if (!profesional) return <div>No se encontró el perfil</div>;

  const renderEstrellas = (valoracion) => {
    const maxEstrellas = 5;
    const estrellasCompletas = Math.floor(valoracion);
    const decimal = valoracion - estrellasCompletas;
    const tieneMediaEstrella = decimal >= 0.5 && decimal < 1;

    return [...Array(maxEstrellas)].map((_, i) => {
      if (i < estrellasCompletas) return <span key={i} className="estrella llena">★</span>;
      if (i === estrellasCompletas && tieneMediaEstrella) return <span key={i} className="estrella media">★</span>;
      return <span key={i} className="estrella vacia">☆</span>;
    });
  };

  // GALERÍA
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

  // TRABAJOS
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

  const traducirEstado = (estado) => {
    switch (estado) {
      case 'terminado': return 'Finalizado por Cliente';
      case 'finalizado_profesional': return 'Finalizado por Profesional';
      case 'cancelado': return 'Cancelado por Cliente';
      case 'cancelado_profesional': return 'Cancelado por Profesional';
      default: return estado;
    }
  };

      const handleVerImagen = (url) => {
        Swal.fire({
          html: `<img src="${url}" style="
            display: block;
            max-width: 90vw;
            max-height: 90vh;
            width: auto;
            height: auto;
            border-radius: 0;
            margin: 0;
          ">`,
          showConfirmButton: false,
          showCloseButton: true,
          background: 'transparent',
          padding: '0',
          backdrop: 'rgba(0,0,0,0.5)' // opcional
        });
      };

  return (
    <div className="perfil-container">

      {/* HEADER */}
      <div className="perfil-header">
        <img
          src={
            profesional.avatar
              ? profesional.avatar.startsWith('http')
                ? profesional.avatar
                : `${CLOUDINARY_URL}${profesional.avatar}`
              : process.env.PUBLIC_URL + '/assets/images/avatar-de-usuario.png'
          }
          alt={profesional.nombre}
          className="avatar-comercial"
        />

        <div className="perfil-info">
          <h2>{profesional.empresa}</h2>
          <p><strong>Nombre:</strong> {profesional.nombre} {profesional.apellido}</p>
          <p><strong>Email:</strong> {profesional.email}</p>
          <p><strong>Tel:</strong> {profesional.telefono}</p>
          <p><strong>Dirección:</strong> {profesional.direccion}</p>
          <p><strong>Valoración promedio:</strong> {renderEstrellas(valoracionPromedio)}</p>
          <p className="descripcion">{profesional.descripcion}</p>
        </div>
      </div>

      {/* GALERÍA */}
      <h3>Galería de trabajos</h3>
      <div className={`imagenes-comercial-container gallery-grid ${fadeGaleria}`}>
        {imagenesPagina.length > 0 ? (
          imagenesPagina.map((img, i) => (
            <img
            key={i}
            src={img.url.startsWith('http') ? img.url : `${CLOUDINARY_URL}${img.url}`}
            alt=""
            className="gallery-img"
            onClick={() => handleVerImagen(img.url.startsWith('http') ? img.url : `${CLOUDINARY_URL}${img.url}`)}
            style={{ cursor: 'pointer' }}
          />
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
              <p><strong>Estado del Trabajo:</strong> {traducirEstado(trabajo.estado)}</p>
              <p>
                <strong>Fecha de contratación:</strong> {new Date(trabajo.fechaContratacion).toLocaleString('es-AR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false
                })}
              </p>
              <p><strong>Cliente:</strong> {trabajo.usuarioComun.nombre} {trabajo.usuarioComun.apellido}</p>
              <p><strong>Comentario:</strong> {trabajo.comentario}</p>
              <p>
                <strong>Valoración:</strong> 
                {["terminado", "finalizado_profesional"].includes(trabajo.estado) && trabajo.valoracion > 0
                  ? renderEstrellas(trabajo.valoracion)
                  : "Sin valoración"}
              </p>
            </div>
          ))
        ) : (
          <p>Este profesional no tiene trabajos realizados</p>
        )}
      </div>

      {/* PAGINACIÓN TRABAJOS */}
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
