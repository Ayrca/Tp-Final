import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import CarruselVertical from '../components/CarruselVertical';

import './estilos/ListaProfesionales.css';
import Swal from 'sweetalert2';

const getIdUsuarioLogueado = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const decodedToken = jwtDecode(token);
  return decodedToken.sub;
};

const ITEMS_PER_PAGE = 8; // 2 columnas × 4 filas

const ListaProfesional = () => {
  const { id } = useParams();
  const [profesionales, setProfesionales] = useState([]);
  const [publicidad, setPublicidad] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const idusuarioComun = getIdUsuarioLogueado();
  const [idOficios, setIdOficios] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const obtenerOficio = async (idProfesional) => {
    try {
      const response = await axios.get(`http://localhost:3000/profesional/${idProfesional}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener oficio:', error);
      return null;
    }
  };

  // -------------------- CARGA DE PROFESIONALES --------------------
  useEffect(() => {
    let url = 'http://localhost:3000/profesional';
    if (id) {
      url += `/oficio/${id}`;
      setIdOficios(id);
    }

    axios
      .get(url)
      .then((response) => {
        setProfesionales(response.data);
        setCargando(false);
      })
      .catch((error) => {
        setError(error);
        setCargando(false);
      });
  }, [id]);

  // -------------------- CARGA DE PUBLICIDADES --------------------
  useEffect(() => {
    axios
      .get("http://localhost:3000/publicidad")
      .then((res) => setPublicidad(res.data))
      .catch((err) => console.error(err));
  }, []);

  // -------------------- PAGINACIÓN --------------------
  const totalPages = Math.ceil(profesionales.length / ITEMS_PER_PAGE);

  const currentProfesionales = profesionales.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const nextPage = () => setCurrentPage((p) => (p < totalPages ? p + 1 : p));
  const prevPage = () => setCurrentPage((p) => (p > 1 ? p - 1 : p));

  // -------------------- ACCIONES --------------------
  const handleContratar = useCallback(
    async (profesional) => {
      if (!idusuarioComun) {
        Swal.fire({
          title: 'Error',
          text: 'Debe estar logueado para contratar',
          icon: 'error',
        });
        return;
      }

      if (idusuarioComun === profesional.idusuarioProfesional) {
        Swal.fire({
          title: 'Error',
          text: 'Los profesionales no pueden contratar',
          icon: 'error',
        });
        return;
      }

      try {
        const response = await axios.get("http://localhost:3000/usuario/" + idusuarioComun);
        const usuarioLogueado = response.data;
        const oficio = await obtenerOficio(profesional.idusuarioProfesional);

        const datosContratacion = {
          usuarioComun: { idusuarioComun: idusuarioComun },
          profesional: { idusuarioProfesional: profesional.idusuarioProfesional },
          rubro: oficio.oficio.nombre,
          telefonoProfesional: profesional.telefono,
          telefonoCliente: usuarioLogueado.telefono,
          estado: "pendiente",
          valoracion: 0,
          comentario: '',
          fechaContratacion: new Date(),
        };

        axios
          .post("http://localhost:3000/trabajoContratado", datosContratacion)
          .then(() => {
            Swal.fire({
              title: 'Éxito',
              text: 'Solicitud enviada correctamente',
              icon: 'success',
            });
          })
          .catch(() => {
            Swal.fire({
              title: 'Error',
              text: 'Error al enviar la solicitud',
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
    },
    [idusuarioComun, idOficios]
  );

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
      const usuarioLogueadoDatos = response.data;

      const mensaje = `Hola ${profesional.nombre}, soy ${usuarioLogueadoDatos.nombre} ${usuarioLogueadoDatos.apellido} desde la app.`;
      const url = `https://wa.me/${telefono}?text=${mensaje}`;
      window.open(url, '_blank');

    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al procesar la solicitud',
        icon: 'error',
      });
    }
  };

  // -------------------- RENDER --------------------
  if (cargando) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="layout-profesionales-wrapper">

      {/* Carrusel vertical izquierdo */}
      <CarruselVertical imagenes={publicidad} />

      <div className="profesionales-center">
        
        {profesionales.length === 0 ? (
          <p>No hay Profesionales disponibles</p>
        ) : (
          <div className="grid-profesionales">
            {currentProfesionales.map((profesional, index) => (
              <article key={index} className="profesional-item compact">
                
                <div className="infoContainer">
                  <img
                    src={profesional.avatar || 'ruta-por-defecto.jpg'}
                    alt={profesional.nombre}
                  />

                  <div className="profesional-data">
                    <div className="profesional-header">
                      <h2>{profesional.nombre} {profesional.apellido}</h2>
                      <label className={profesional.estado ? 'disponible' : 'no-disponible'}>
                        {profesional.estado ? 'Disponible' : 'No Disponible'}
                      </label>
                    </div>

                    <div className="datosContainer">
                      <h2>{profesional.empresa}</h2>
                      <p>Email: {profesional.email}</p>
                      <p>Tel: {profesional.telefono}</p>
                      <p>Dirección: {profesional.direccion}</p>
                      <p>Valoración: {profesional.valoracion}</p>
                    </div>

                    <div className="profesional-buttons">
                      <Link
                        to={`/profesional/perfil/${profesional.idusuarioProfesional}`}
                        state={{ profesional }}
                      >
                        <button className="verMas">Ver Más</button>
                      </Link>

                      <button className="conectar" onClick={() => handleConectar(profesional)}>
                        Conectar
                      </button>

                      <button className="contratar" onClick={() => handleContratar(profesional)}>
                        Contratar
                      </button>
                    </div>
                  </div>
                </div>

              </article>
            ))}
          </div>
        )}

        {/* PAGINADOR */}
        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={prevPage} disabled={currentPage === 1}>
              ◀
            </button>

            <span>{currentPage} / {totalPages}</span>

            <button onClick={nextPage} disabled={currentPage === totalPages}>
              ▶
            </button>
          </div>
        )}

      </div>

      {/* Carrusel vertical derecho */}
      <CarruselVertical imagenes={publicidad} />

    </div>
  );
};

export default ListaProfesional;