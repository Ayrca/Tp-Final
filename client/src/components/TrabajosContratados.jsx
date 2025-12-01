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

  const fetchTrabajos = async () => {
    try {
      let response;
      if (idProfesional) {
        response = await axios.get(`${BASE_URL}/trabajoContratado/${idProfesional}`);
      } else if (idusuarioComun) {
        response = await axios.get(`${BASE_URL}/trabajoContratado/usuario/${idusuarioComun}`);
      }
      if (response && Array.isArray(response.data)) {
        setTrabajos(response.data);
      } else {
        setError('La respuesta de la API no es un array');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchTrabajos();
  }, [idProfesional, idusuarioComun]);

  const handleCancelar = async (idcontratacion) => {
    const { value: comentario } = await Swal.fire({
      title: '¿Estás seguro de cancelar?',
      text: 'Proporciona un comentario sobre la razón de la cancelación',
      input: 'textarea',
      inputPlaceholder: 'Comentario',
      showCancelButton: true,
      confirmButtonText: 'Cancelar',
      cancelButtonText: 'Volver',
    });
    if (comentario) {
      try {
        const response = await axios.put(`${BASE_URL}/trabajoContratado/${idcontratacion}`, {
          estado: 'cancelado',
          comentario,
        });
        if (response.status === 200) fetchTrabajos();
      } catch (error) {
        console.error('Error al cancelar el trabajo:', error);
      }
    }
  };

  const handleFinalizar = async (idcontratacion, idusuarioProfesional) => {
    const { value: formValues } = await Swal.fire({
      title: 'Finalizar trabajo',
      html:
        '<input id="comentario" class="swal2-input" placeholder="Comentario">' +
        '<input id="valoracion" type="number" class="swal2-input" placeholder="Valoración (1-5)">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Finalizar',
      cancelButtonText: 'Volver',
      preConfirm: () => ({
        comentario: document.getElementById('comentario').value,
        valoracion: document.getElementById('valoracion').value,
      }),
    });

    if (formValues) {
      try {
        const response = await axios.put(`${BASE_URL}/trabajoContratado/${idcontratacion}`, {
          estado: 'terminado',
          comentario: formValues.comentario,
          valoracion: formValues.valoracion,
        });
        if (response.status === 200) {
          await actualizarValoracionProfesional(idusuarioProfesional);
          fetchTrabajos();
        }
      } catch (error) {
        console.error('Error al finalizar el trabajo:', error);
      }
    }
  };

  const actualizarValoracionProfesional = async (idusuarioProfesional) => {
    try {
      const response = await axios.get(`${BASE_URL}/trabajoContratado/${idusuarioProfesional}`);
      const contrataciones = response.data;
      const valoraciones = contrataciones
        .filter((c) => c.estado === 'terminado' && c.valoracion !== null)
        .map((c) => c.valoracion);
      const valoracionPromedio =
        valoraciones.length > 0
          ? valoraciones.reduce((a, b) => a + b, 0) / valoraciones.length
          : 0;
      await axios.put(`${BASE_URL}/profesional/${idusuarioProfesional}`, { valoracion: valoracionPromedio });
    } catch (error) {
      console.error('Error al actualizar la valoración del profesional:', error);
    }
  };

  const handleFinalizarProfesional = async (idcontratacion) => {
    try {
      const response = await axios.put(`${BASE_URL}/trabajoContratado/${idcontratacion}`, {
        estado: 'terminado',
      });
      if (response.status === 200) {
        await actualizarValoracionProfesional(idProfesional);
        Swal.fire({ title: 'Finalizado', text: 'El trabajo ha sido finalizado correctamente', icon: 'success' });
        fetchTrabajos();
      }
    } catch (error) {
      console.error('Error al finalizar el trabajo:', error);
    }
  };

  const handleCancelarProfesional = async (idcontratacion) => {
    try {
      const response = await axios.put(`${BASE_URL}/trabajoContratado/${idcontratacion}`, {
        estado: 'cancelado',
      });
      if (response.status === 200) {
        Swal.fire({ title: 'Cancelado', text: 'El trabajo ha sido cancelado correctamente', icon: 'success' });
        fetchTrabajos();
      }
    } catch (error) {
      console.error('Error al cancelar el trabajo:', error);
    }
  };

  return (
    <div className="trabajos-contratados">
      {Array.isArray(trabajos) && trabajos.length > 0 ? (
        trabajos.map((trabajo) => (
          <div key={trabajo.idcontratacion} className="tarjeta-trabajo">
            {idProfesional ? (
              <p>
                <span>Cliente:</span> <span className="dato">{trabajo.usuarioComun?.nombre}</span>
              </p>
            ) : (
              <p>
                <span>Profesional:</span> <span className="dato">{trabajo.profesional?.nombre}</span>
              </p>
            )}
            <p>
              <span>Rubro:</span> <span className="dato">{trabajo.rubro}</span>
            </p>
            <p>
              <span>Estado del Trabajo:</span> <span className="dato">{trabajo.estado}</span>
            </p>
            <p>
              <span>Fecha de contratación:</span>{' '}
              <span className="dato">
                {new Date(trabajo.fechaContratacion).toLocaleString('es-AR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false,
                })}
              </span>
            </p>
            <p>
              <span>Valoración:</span> <span className="dato">{trabajo.valoracion}</span>
            </p>
            <p>
              <span>Comentario:</span> <span className="dato">{trabajo.comentario}</span>
            </p>
            <p>
              <span>{esProfesional ? 'Teléfono del Cliente:' : 'Teléfono del Profesional:'}</span>{' '}
              <span className="dato">{esProfesional ? trabajo.telefonoCliente : trabajo.telefonoProfesional}</span>
            </p>

            {trabajo.estado !== 'terminado' && trabajo.estado !== 'cancelado' && (
              <div className="botones-trabajo">
                {idProfesional ? (
                  <div>
                    <button className="finalizar-btn" onClick={() => handleFinalizarProfesional(trabajo.idcontratacion)}>
                      Finalizar
                    </button>
                    <button className="cancelar-btn" onClick={() => handleCancelarProfesional(trabajo.idcontratacion)}>
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div>
                    <button className="finalizar-btn" onClick={() => handleFinalizar(trabajo.idcontratacion, trabajo.profesional.idusuarioProfesional)}>
                      Finalizar
                    </button>
                    <button className="cancelar-btn" onClick={() => handleCancelar(trabajo.idcontratacion)}>
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No hay trabajos contratados</p>
      )}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default TrabajosContratados;