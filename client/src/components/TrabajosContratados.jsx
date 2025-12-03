import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './estilos/trabajosContratados.css';
import Swal from 'sweetalert2';
import { jwtDecode } from "jwt-decode";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const TrabajosContratados = ({ idProfesional, idusuarioComun }) => {
  const [trabajos, setTrabajos] = useState([]);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const esProfesional = token ? jwtDecode(token).tipo === 'profesional' : false;
  const idLogueado = esProfesional ? jwtDecode(token).sub : null;

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [fadeTrabajos, setFadeTrabajos] = useState("fade-in");
  const trabajosPorPagina = 9;

  // Función auxiliar para ordenar trabajos
  const actualizarTrabajos = (data) => {
    const trabajosOrdenados = Array.isArray(data)
      ? data.sort((a, b) => new Date(b.fechaContratacion) - new Date(a.fechaContratacion))
      : [];
    setTrabajos(trabajosOrdenados);
  };

useEffect(() => {
  const fetchTrabajos = async () => {
    try {
      let response;
      if (idProfesional) {
        response = await axios.get(`${BASE_URL}/trabajoContratado/${idProfesional}`);
      } else if (idusuarioComun) {
        response = await axios.get(`${BASE_URL}/trabajoContratado/usuario/${idusuarioComun}`);
      } else return;

      if (response && Array.isArray(response.data)) {
        console.log("Trabajos recibidos:", response.data);
        const trabajosOrdenados = response.data.sort(
          (a, b) => new Date(b.fechaContratacion) - new Date(a.fechaContratacion)
        );
        setTrabajos(trabajosOrdenados);
        setError(null);
      } else {
        setTrabajos([]);
        setError('No se pudo obtener los trabajos correctamente');
      }
    } catch (err) {
      setTrabajos([]);
      setError('Error al conectar con la API');
      console.error(err);
    }
  };

  fetchTrabajos();
}, [idProfesional, idusuarioComun]);


  // PAGINACIÓN
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

  // Funciones auxiliares
  const traducirEstado = (estado) => {
    switch (estado) {
      case 'terminado': return 'Finalizado por Cliente';
      case 'finalizado_profesional': return 'Finalizado por Profesional';
      case 'cancelado': return 'Cancelado por Cliente';
      case 'cancelado_profesional': return 'Cancelado por Profesional';
      default: return estado;
    }
  };

  const renderEstrellas = (valoracion) => {
    const maxEstrellas = 5;
    return [...Array(maxEstrellas)].map((_, i) => (
      <span key={i} className={i < valoracion ? "estrella llena" : "estrella vacia"}>
        {i < valoracion ? "★" : "☆"}
      </span>
    ));
  };

  // Funciones de finalizar/cancelar
  const crearModalValoracion = async () => {
    return Swal.fire({
      title: 'Finalizar trabajo',
      html: `
        <textarea id="comentario" class="swal2-textarea" placeholder="Escribe un comentario..."></textarea>
        <div class="star-container">
          <span class="star" data-value="1">★</span>
          <span class="star" data-value="2">★</span>
          <span class="star" data-value="3">★</span>
          <span class="star" data-value="4">★</span>
          <span class="star" data-value="5">★</span>
        </div>
        <input type="hidden" id="valoracion">
      `,
      showCancelButton: true,
      confirmButtonText: 'Finalizar',
      cancelButtonText: 'Volver',
      didOpen: () => {
        const estrellas = Swal.getPopup().querySelectorAll('.star');
        const inputValoracion = Swal.getPopup().querySelector('#valoracion');
        estrellas.forEach((star, idx) => {
          star.addEventListener('click', () => {
            const value = parseInt(star.dataset.value);
            inputValoracion.value = value;
            estrellas.forEach((s, i) => i < value ? s.classList.add('selected') : s.classList.remove('selected'));
          });
          star.addEventListener('mouseover', () => {
            estrellas.forEach((s, i) => s.style.color = i <= idx ? '#ffa500' : '#ccc');
          });
          star.addEventListener('mouseout', () => {
            estrellas.forEach((s, i) => s.style.color = i < parseInt(inputValoracion.value) ? 'gold' : '#ccc');
          });
        });
      },
      preConfirm: () => {
        const valoracion = parseInt(document.getElementById('valoracion').value);
        const comentario = document.getElementById('comentario').value.trim();

        if (!comentario && (isNaN(valoracion) || valoracion < 1 || valoracion > 5)) {
          Swal.showValidationMessage('Debes ingresar un comentario y seleccionar una valoración entre 1 y 5');
          return false;
        }

        if (!comentario) {
          Swal.showValidationMessage('Debes ingresar un comentario');
          return false;
        }

        if (isNaN(valoracion) || valoracion < 1 || valoracion > 5) {
          Swal.showValidationMessage('Debes seleccionar una valoración entre 1 y 5');
          return false;
        }

        return { comentario, valoracion };
      },
    });
  };

  const handleFinalizar = async (idcontratacion) => {
    const formValues = await crearModalValoracion();
    if (!formValues?.value) return;

    const { comentario, valoracion } = formValues.value;

    try {
      await axios.put(`${BASE_URL}/trabajoContratado/${idcontratacion}`, { estado: 'terminado', comentario, valoracion });
      Swal.fire('Trabajo finalizado', 'Se guardó correctamente', 'success');

      const resp = await axios.get(
        esProfesional
          ? `${BASE_URL}/trabajoContratado/${idLogueado}`
          : `${BASE_URL}/trabajoContratado/usuario/${idusuarioComun}`
      );
      actualizarTrabajos(resp.data);

    } catch (error) {
      console.error('Error al finalizar el trabajo:', error);
    }
  };

  const handleCancelar = async (idcontratacion) => {
    const { value: comentario } = await Swal.fire({
      title: '¿Estás seguro de cancelar?',
      input: 'textarea',
      inputPlaceholder: 'Explica la razón de la cancelación',
      showCancelButton: true,
      confirmButtonText: 'Cancelar',
      cancelButtonText: 'Volver',
      preConfirm: (value) => {
        if (!value || value.trim() === '') {
          Swal.showValidationMessage('Debes ingresar un comentario antes de cancelar');
          return false;
        }
        return value;
      }
    });

    if (!comentario) return;

    try {
      await axios.put(`${BASE_URL}/trabajoContratado/${idcontratacion}`, { estado: 'cancelado', comentario });
      Swal.fire('Cancelado', 'Se guardó correctamente', 'success');

      const resp = await axios.get(
        esProfesional
          ? `${BASE_URL}/trabajoContratado/${idLogueado}`
          : `${BASE_URL}/trabajoContratado/usuario/${idusuarioComun}`
      );
      actualizarTrabajos(resp.data);

    } catch (error) {
      console.error('Error al cancelar el trabajo:', error);
    }
  };

  const handleFinalizarProfesional = async (idcontratacion) => {
    const { value: comentario } = await Swal.fire({
      title: 'Finalizar trabajo',
      input: 'textarea',
      inputPlaceholder: 'Deja un comentario sobre el trabajo realizado',
      showCancelButton: true,
      confirmButtonText: 'Finalizar',
      cancelButtonText: 'Volver',
      preConfirm: (value) => {
        if (!value || value.trim() === '') {
          Swal.showValidationMessage('Debes ingresar un comentario antes de finalizar');
          return false;
        }
        return value.trim();
      }
    });

    if (!comentario) return;

    try {
      await axios.put(`${BASE_URL}/trabajoContratado/${idcontratacion}`, {
        estado: 'finalizado_profesional',
        comentario
      });

      Swal.fire('Trabajo finalizado', 'Se guardó correctamente', 'success');

      const resp = await axios.get(
        esProfesional
          ? `${BASE_URL}/trabajoContratado/${idLogueado}`
          : `${BASE_URL}/trabajoContratado/usuario/${idusuarioComun}`
      );
      actualizarTrabajos(resp.data);

    } catch (error) {
      console.error('Error al finalizar el trabajo:', error);
      Swal.fire('Error', 'Ocurrió un error al finalizar el trabajo', 'error');
    }
  };

  const handleCancelarProfesional = async (idcontratacion) => {
    const formValues = await Swal.fire({
      title: 'Cancelar trabajo',
      input: 'textarea',
      inputPlaceholder: 'Explica la razón de la cancelación',
      showCancelButton: true,
      confirmButtonText: 'Cancelar trabajo',
      cancelButtonText: 'Volver',
      preConfirm: (value) => {
        if (!value || value.trim() === '') {
          Swal.showValidationMessage('Debes ingresar un comentario antes de cancelar');
          return false;
        }
        return value.trim();
      }
    });

    if (!formValues?.value) return;
    const comentario = formValues.value;

    try {
      await axios.put(`${BASE_URL}/trabajoContratado/${idcontratacion}`, { 
        estado: 'cancelado_profesional', 
        comentario 
      });

      Swal.fire('Cancelado', 'Se guardó correctamente', 'success');

      const resp = await axios.get(
        esProfesional
          ? `${BASE_URL}/trabajoContratado/${idLogueado}`
          : `${BASE_URL}/trabajoContratado/usuario/${idusuarioComun}`
      );
      actualizarTrabajos(resp.data);

    } catch (error) {
      console.error('Error al cancelar el trabajo:', error);
      Swal.fire('Error', 'Ocurrió un error al cancelar el trabajo', 'error');
    }
  };

  return (
    <div className="trabajos-contratados">
      <div className={`trabajos-grid gallery-grid ${fadeTrabajos}`}>
        {trabajosPagina.length > 0 ? (
          trabajosPagina.map((trabajo) => (
            <div key={trabajo.idcontratacion} className="tarjeta-trabajo">
            {idProfesional ? (
              <p>
                <span>Cliente:</span> 
                <span className="dato">{trabajo.usuarioComun?.nombre} {trabajo.usuarioComun?.apellido}</span>
              </p>
            ) : (
              <p>
                <span>Profesional:</span> 
                <span className="dato">{trabajo.profesional?.nombre} {trabajo.profesional?.apellido}</span>
              </p>
            )}
              <p><span>Rubro:</span> <span className="dato">{trabajo.rubro}</span></p>
              <p><span>Estado del Trabajo:</span> <span className="dato">{traducirEstado(trabajo.estado)}</span></p>
              <p>
                <span>Fecha de contratación:</span> 
                <span className="dato">{new Date(trabajo.fechaContratacion).toLocaleString('es-AR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false
                })}</span>
              </p>
              <p>
                <span>Valoración:</span>
                <span className="dato">
                  {trabajo.valoracion ? renderEstrellas(trabajo.valoracion) : "Sin valoración"}
                </span>
              </p>
              <p><span>Comentario:</span> <span className="dato">{trabajo.comentario}</span></p>
              <p><span>{esProfesional ? 'Telefono del Cliente:' : 'Telefono del Profesional:'}</span> 
                 <span className="dato">{esProfesional ? trabajo.telefonoCliente : trabajo.telefonoProfesional}</span>
              </p>

              {!["terminado", "cancelado", "finalizado_profesional", "cancelado_profesional"].includes(trabajo.estado) && (
                <div className="botones-trabajo">
                  {idProfesional ? (
                    <>
                      <button className="finalizar-btn" onClick={() => handleFinalizarProfesional(trabajo.idcontratacion)}>Finalizar</button>
                      <button className="cancelar-btn" onClick={() => handleCancelarProfesional(trabajo.idcontratacion)}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button className="finalizar-btn" onClick={() => handleFinalizar(trabajo.idcontratacion)}>Finalizar</button>
                      <button className="cancelar-btn" onClick={() => handleCancelar(trabajo.idcontratacion)}>Cancelar</button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No hay trabajos contratados</p>
        )}
      </div>

      {totalPaginasTrabajos > 1 && (
        <div className="gallery-pagination-wrapper">
          <div className="gallery-pagination">
            <button
              className="pag-btn"
              disabled={paginaActual === 1}
              onClick={() => cambiarPaginaTrabajos(paginaActual - 1)}
            >
              ◀
            </button>

            <span className="pag-indicator">{paginaActual} / {totalPaginasTrabajos}</span>

            <button
              className="pag-btn"
              disabled={paginaActual === totalPaginasTrabajos}
              onClick={() => cambiarPaginaTrabajos(paginaActual + 1)}
            >
              ▶
            </button>
          </div>
        </div>
      )}

      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default TrabajosContratados;