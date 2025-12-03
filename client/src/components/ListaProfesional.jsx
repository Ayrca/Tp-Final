import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import CarruselVertical from '../components/CarruselVertical';
import Carrusel from '../components/Carrusel';
import Swal from 'sweetalert2';
import './estilos/ListaProfesionales.css';
import './estilos/ListaProfesionalesMobile.css';

const BASE_URL = process.env.REACT_APP_BASE_URL;

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
  const [nombreOficio, setNombreOficio] = useState('');

  // Obtener oficio de un profesional
  const obtenerOficio = async (idProfesional) => {
    try {
      const response = await axios.get(`${BASE_URL}/profesional/${idProfesional}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener oficio:', error);
      return null;
    }
  };

  // Obtener valoración promedio de un profesional
  const obtenerValoracionPromedio = async (idProfesional) => {
    try {
      const response = await axios.get(`${BASE_URL}/trabajoContratado/${idProfesional}`);
      const trabajos = response.data || [];
      const trabajosValorados = trabajos.filter(t => t.valoracion && t.valoracion > 0);
      if (trabajosValorados.length === 0) return 0;
      const suma = trabajosValorados.reduce((acc, t) => acc + t.valoracion, 0);
      return suma / trabajosValorados.length;
    } catch (error) {
      console.error('Error al obtener valoración:', error);
      return 0;
    }
  };

  // Título del oficio seleccionado
  useEffect(() => {
    if (!id) return;
    axios.get(`${BASE_URL}/oficios/${id}`)
      .then(res => setNombreOficio(res.data.nombre))
      .catch(err => console.error("Error al obtener oficio:", err));
  }, [id]);

  // Lista de profesionales (o por oficio)
  useEffect(() => {
    let url = `${BASE_URL}/profesional`;
    if (id) {
      url += `/oficio/${id}`;
      setIdOficios(id);
    }

    axios.get(url)
      .then(async (response) => {
        const profs = response.data || [];

        // Calcular valoración promedio para cada profesional
        const profsConValoracion = await Promise.all(
          profs.map(async (prof) => {
            const valoracionPromedio = await obtenerValoracionPromedio(prof.idusuarioProfesional);
            return { ...prof, valoracionPromedio };
          })
        );

        setProfesionales(profsConValoracion);
        setCargando(false);
      })
      .catch((error) => {
        setError(error);
        setCargando(false);
      });
  }, [id]);

  // Publicidad
  useEffect(() => {
    axios.get(`${BASE_URL}/publicidad`)
      .then((res) => setPublicidad(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Contratar profesional
  const handleContratar = useCallback(async (profesional) => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({ title: 'Error', text: 'Debe estar logueado para contratar', icon: 'error' });
      return;
    }

    const usuarioLogueado = jwtDecode(token);

    if (usuarioLogueado.tipo === 'profesional') {
      Swal.fire({ title: 'Error', text: 'Los profesionales no pueden contratar', icon: 'error' });
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/usuario/${usuarioLogueado.sub}`);
      const usuario = response.data;

      const oficio = await obtenerOficio(profesional.idusuarioProfesional);

      const datosContratacion = {
        usuarioComun: { idusuarioComun: usuario.idusuarioComun },
        profesional: { idusuarioProfesional: profesional.idusuarioProfesional },
        rubro: oficio?.oficio?.nombre || '',
        telefonoProfesional: profesional.telefono,
        telefonoCliente: usuario.telefono,
        estado: "pendiente",
        valoracion: 0,
        comentario: '',
        fechaContratacion: new Date(),
      };

      await axios.post(`${BASE_URL}/trabajoContratado`, datosContratacion);

      Swal.fire({
        title: 'Éxito',
        text: 'La solicitud de contrato se ha enviado correctamente',
        icon: 'success',
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al procesar la solicitud',
        icon: 'error',
      });
    }
  }, [idOficios]);

  // Conectar profesional (WhatsApp)
  const handleConectar = async (profesional) => {
    if (!idusuarioComun) {
      Swal.fire({ title: 'Error', text: 'Debe estar logueado para contactar', icon: 'error' });
      return;
    }
    const usuarioLogueadoToken = jwtDecode(localStorage.getItem('token'));
    if (usuarioLogueadoToken.tipo === 'profesional') {
      Swal.fire({ title: 'Error', text: 'Los profesionales no pueden contactar a otros profesionales', icon: 'error' });
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/usuario/${idusuarioComun}`);
      const usuarioLogueado = response.data;
      const mensaje = `Hola ${profesional.nombre}, mi nombre es ${usuarioLogueado.nombre} ${usuarioLogueado.apellido} estoy intentando comunicarme desde la app Tu Oficio para hacerte una consulta.`;
      const url = `https://wa.me/${profesional.telefono}?text=${encodeURIComponent(mensaje)}`;
      window.open(url, '_blank');
    } catch (error) {
      Swal.fire({ title: 'Error', text: 'Ocurrió un error al procesar la solicitud', icon: 'error' });
    }
  };

  // Paginación
  const totalPages = Math.ceil(profesionales.length / ITEMS_PER_PAGE);
  const currentProfesionales = profesionales.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  if (cargando) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {/* Wrapper principal para desktop */}
      <div className="layout-profesionales-wrapper">
        {/* Carrusel izquierdo */}
        <div className="carrusel-desktop izquierda">
          <CarruselVertical altura={alturaCarrusel} imagenes={publicidad} />
        </div>

        {/* Center con cards */}
        <div className="profesionales-center" ref={centroRef}>
          {profesionales.length === 0 ? (
            <p>No hay profesionales disponibles</p>
          ) : (
            <>
              {nombreOficio && (
                <h1 className="titulo-oficio">Profesionales de {nombreOficio}</h1>
              )}
              <div className="grid-profesionales">
                {currentProfesionales.map((profesional, index) => (
                  <article key={index} className="profesional-item compact">
                    <div className="infoContainer">
                      <img
                        src={
                          profesional.avatar
                            ? profesional.avatar.startsWith('http')
                              ? profesional.avatar
                              : `${BASE_URL}${profesional.avatar}`
                            : process.env.PUBLIC_URL + '/assets/images/avatar-de-usuario.png'
                        }
                        alt={profesional.nombre}
                        className="avatar-profesional"
                      />
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
                            <Estrellas valoracion={profesional.valoracionPromedio || profesional.valoracion} />
                          </div>
                        </div>

                        <div className="profesional-buttons">
                          <Link to={`/profesional/perfil/${profesional.idusuarioProfesional}`} state={{ profesional }}>
                            <button className="verMas">Ver Más</button>
                          </Link>

                          <button
                            className="conectar"
                            onClick={() => {
                              if (!profesional.disponible) {
                                Swal.fire({
                                  icon: 'warning',
                                  title: 'Profesional no disponible',
                                  text: 'Este profesional se encuentra de vacaciones o no disponible. Por favor intenta con otro profesional.',
                                });
                                return;
                              }
                              handleConectar(profesional);
                            }}
                            disabled={!profesional.disponible}
                          >
                            Conectar
                          </button>

                          <button
                            className="contratar"
                            onClick={() => {
                              if (!profesional.disponible) {
                                Swal.fire({
                                  icon: 'warning',
                                  title: 'Profesional no disponible',
                                  text: 'Este profesional se encuentra de vacaciones o no disponible. Por favor intenta con otro profesional.',
                                });
                                return;
                              }
                              handleContratar(profesional);
                            }}
                            disabled={!profesional.disponible}
                          >
                            Contratar
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button onClick={prevPage} disabled={currentPage === 1}>◀</button>
                  <span>{currentPage} / {totalPages}</span>
                  <button onClick={nextPage} disabled={currentPage === totalPages}>▶</button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Carrusel derecho */}
        <div className="carrusel-desktop derecha">
          <CarruselVertical altura={alturaCarrusel} imagenes={publicidad} />
        </div>
      </div>

      {/* Carrusel horizontal solo para mobile */}
      <div className="carrusel-mobile">
        <Carrusel itemsPerView={1} altura={alturaCarrusel} />
      </div>
    </>
  );
};

export default ListaProfesional;
