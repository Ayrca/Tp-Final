import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import CarruselVertical from '../components/CarruselVertical';
import Carrusel from '../components/Carrusel';
import Swal from 'sweetalert2';

import './estilos/ListaProfesionales.css';
import './estilos/ListaProfesionalesMobile.css';

const getIdUsuarioLogueado = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const decodedToken = jwtDecode(token);
  return decodedToken.sub;
};

const ITEMS_PER_PAGE = 8;

// Componente Estrellas
const Estrellas = ({ valoracion }) => {
  const estrellasCompletas = Math.floor(valoracion);
  const tieneMediaEstrella = valoracion - estrellasCompletas >= 0.5;
  const totalEstrellas = 5;

  return (
    <div className="estrellas">
      {Array.from({ length: totalEstrellas }, (_, i) => {
        if (i < estrellasCompletas) return <span key={i} className="estrella llena">★</span>;
        if (i === estrellasCompletas && tieneMediaEstrella) return <span key={i} className="estrella media">★</span>;
        return <span key={i} className="estrella vacia">☆</span>;
      })}
    </div>
  );
};

const ListaProfesional = () => {
  const { id } = useParams();
  const [profesionales, setProfesionales] = useState([]);
  const [publicidad, setPublicidad] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const idusuarioComun = getIdUsuarioLogueado();
  const [idOficios, setIdOficios] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const centroRef = useRef(null);
  const [alturaCarrusel, setAlturaCarrusel] = useState(0);

  const obtenerOficio = async (idProfesional) => {
    try {
      const response = await axios.get(`http://localhost:3000/profesional/${idProfesional}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener oficio:', error);
      return null;
    }
  };

  useEffect(() => {
    let url = 'http://localhost:3000/profesional';
    if (id) {
      url += `/oficio/${id}`;
      setIdOficios(id);
    }
    axios.get(url)
      .then((response) => {
        setProfesionales(response.data);
        setCargando(false);
      })
      .catch((error) => {
        setError(error);
        setCargando(false);
      });
  }, [id]);

  useEffect(() => {
    axios.get("http://localhost:3000/publicidad")
      .then((res) => setPublicidad(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (centroRef.current) {
      setAlturaCarrusel(centroRef.current.offsetHeight);
    }
  }, [profesionales, currentPage]);

  const totalPages = Math.ceil(profesionales.length / ITEMS_PER_PAGE);
  const currentProfesionales = profesionales.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const nextPage = () => setCurrentPage((p) => (p < totalPages ? p + 1 : p));
  const prevPage = () => setCurrentPage((p) => (p > 1 ? p - 1 : p));

  const handleContratar = useCallback(async (profesional) => {
    if (!idusuarioComun) {
      Swal.fire({ title: 'Error', text: 'Debe estar logueado para contratar', icon: 'error' });
      return;
    }
    if (idusuarioComun === profesional.idusuarioProfesional) {
      Swal.fire({ title: 'Error', text: 'Los profesionales no pueden contratar', icon: 'error' });
      return;
    }
    try {
      const response = await axios.get(`http://localhost:3000/usuario/${idusuarioComun}`);
      const usuarioLogueado = response.data;
      const oficio = await obtenerOficio(profesional.idusuarioProfesional);

      const datosContratacion = {
        usuarioComun: { idusuarioComun },
        profesional: { idusuarioProfesional: profesional.idusuarioProfesional },
        rubro: oficio.oficio.nombre,
        telefonoProfesional: profesional.telefono,
        telefonoCliente: usuarioLogueado.telefono,
        estado: "pendiente",
        valoracion: 0,
        comentario: '',
        fechaContratacion: new Date(),
      };

    axios.post("http://localhost:3000/trabajoContratado", datosContratacion)
          .then(response => {
            console.log(response);
            Swal.fire({
              title: 'Éxito',
              text: 'La solicitud de contrato se ha enviado correctamente',
              icon: 'success',
            });
          })
          .catch(error => {
            console.error(error);
            Swal.fire({
              title: 'Error',
              text: 'Ocurrió un error al procesar la solicitud',
              icon: 'error',
            });
          });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al procesar la solicitud',
          icon: 'error',
        });
      }
    }, [idusuarioComun, idOficios]);

    const handleConectar = async (profesional) => {
      if (!idusuarioComun) {
        Swal.fire({
          title: 'Error',
          text: 'Debe estar logueado para contactar',
          icon: 'error',
        });
        return;
      }
      const usuarioLogueado = jwtDecode(localStorage.getItem('token'));
      if (usuarioLogueado.tipo === 'profesional') {
        Swal.fire({
          title: 'Error',
          text: 'Los profesionales no pueden contactar a otros profesionales',
          icon: 'error',
        });
      return;
      }

      try {
        const telefono = profesional.telefono;
        const response = await axios.get("http://localhost:3000/usuario/" + idusuarioComun);
        const usuarioLogueado = response.data;
        const mensaje = `Hola ${profesional.nombre}, soy ${usuarioLogueado.nombre} ${usuarioLogueado.apellido} estoy intentando comunicarme desde la app Tu Oficio para hacerte una consulta.`;
        const url = `https://wa.me/${telefono}?text=${mensaje}`;
        window.open(url, '_blank');
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al procesar la solicitud',
          icon: 'error',
        });
      }
    };


      if (cargando) {
        return <p>Cargando...</p>;
      }
      if (error) {
        return <p>Error: {error.message}</p>;
      }

  return (
    <div className="layout-profesionales-wrapper">

      <div className="carrusel-desktop">
        <CarruselVertical altura={alturaCarrusel} imagenes={publicidad} />
      </div>

      <div className="carrusel-mobile">
        <Carrusel itemsPerView={1} altura={alturaCarrusel} />
      </div>

      <div className="profesionales-center" ref={centroRef}>
        {profesionales.length === 0 ? (
          <p>No hay profesionales disponibles</p>
        ) : (
          <div className="grid-profesionales">
            {currentProfesionales.map((profesional, index) => (
              <article key={index} className="profesional-item compact">
                <div className="infoContainer">
                  <img src={profesional.avatar || 'ruta-por-defecto.jpg'} alt={profesional.nombre} />
                  <div className="profesional-data">
                    <div className="profesional-header">
                      <h2>{profesional.nombre} {profesional.apellido}</h2>
                      <label className={profesional.disponible ? 'disponible' : 'no-disponible'}>
                        {profesional.disponible ? 'Disponible' : 'No Disponible'}
                      </label>
                    </div>
                    <div className="datosContainer">
                      <h2>{profesional.empresa}</h2>
                      <p>Email: {profesional.email}</p>
                      <p>Tel: {profesional.telefono}</p>
                      <p>Dirección: {profesional.direccion}</p>
                      <div>
                        <label>Valoración:</label>
                        <Estrellas valoracion={profesional.valoracion} />
                      </div>
                    </div>
                    <div className="profesional-buttons">
                      <Link to={`/profesional/perfil/${profesional.idusuarioProfesional}`} state={{ profesional }}>
                        <button className="verMas">Ver Más</button>
                      </Link>
                      <button className="conectar" onClick={() => handleConectar(profesional)}>Conectar</button>
                      <button className="contratar" onClick={() => handleContratar(profesional)}>Contratar</button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={prevPage} disabled={currentPage === 1}>◀</button>
            <span>{currentPage} / {totalPages}</span>
            <button onClick={nextPage} disabled={currentPage === totalPages}>▶</button>
          </div>
        )}
      </div>

      <div className="carrusel-desktop">
        <CarruselVertical altura={alturaCarrusel} imagenes={publicidad} />
      </div>

      <div className="carrusel-mobile">
        <Carrusel itemsPerView={1} altura={alturaCarrusel} />
      </div>

    </div>
  );
};

export default ListaProfesional;