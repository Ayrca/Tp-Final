import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './estilos/ManejoProfesionales.css';
import Swal from 'sweetalert2';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const ManejoProfesionales = () => {
  const [profesionales, setProfesionales] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/profesional`)
      .then((response) => setProfesionales(response.data))
      .catch((error) => console.error('Error al traer profesionales:', error));
  }, []);

  const handleBaneo = (id) => {
    Swal.fire({
      title: '¿Estás seguro de banear a este profesional?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, banear',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.put(`${BASE_URL}/profesional/${id}/baneo`)
          .then(() => {
            setProfesionales(profesionales.map((profesional) =>
              profesional.idusuarioProfesional === id
                ? { ...profesional, estadoCuenta: false }
                : profesional
            ));
            Swal.fire('Profesional baneado', '', 'success');
          })
          .catch((error) => {
            console.error('Error al banear profesional:', error);
            Swal.fire('Error', 'No se pudo banear al profesional', 'error');
          });
      }
    });
  };

  const handleDesbloqueo = (id) => {
    Swal.fire({
      title: '¿Estás seguro de desbloquear a este profesional?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, desbloquear',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.put(`${BASE_URL}/profesional/${id}/desbloqueo`)
          .then(() => {
            setProfesionales(profesionales.map((profesional) =>
              profesional.idusuarioProfesional === id
                ? { ...profesional, estadoCuenta: true }
                : profesional
            ));
            Swal.fire('Profesional desbloqueado', '', 'success');
          })
          .catch((error) => {
            console.error('Error al desbloquear profesional:', error);
            Swal.fire('Error', 'No se pudo desbloquear al profesional', 'error');
          });
      }
    });
  };

  return (
    <div className="manejo-profesionales">
      <table className="tabla-profesionales">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Fecha Nacimiento</th>
            <th>Avatar</th>
            <th>Estado Cuenta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(profesionales) && profesionales.length > 0 ? (
            profesionales.map((profesional) => (
              <tr key={profesional.idusuarioProfesional}>
                <td>{profesional.idusuarioProfesional}</td>
                <td>{profesional.nombre}</td>
                <td>{profesional.apellido}</td>
                <td>{profesional.email}</td>
                <td>{profesional.telefono}</td>
                <td>{profesional.direccion}</td>
                <td>
                  {profesional.fechaNacimiento
                    ? new Date(profesional.fechaNacimiento).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })
                    : ''}
                </td>
                <td>
                  <img
                    src={
                      profesional.avatar
                        ? profesional.avatar.startsWith('http')
                          ? profesional.avatar
                          : '/assets/images/avatar-de-usuario.png'
                        : '/assets/images/avatar-de-usuario.png'
                    }
                    alt="Avatar"
                    width="50"
                    height="50"
                  />
                </td>
                <td className={profesional.estadoCuenta ? 'activo' : 'bloqueado'}>
                  {profesional.estadoCuenta ? 'Activo' : 'Bloqueado'}
                </td>
                <td>
                  {profesional.estadoCuenta ? (
                    <button className="btn-baneo-prof" onClick={() => handleBaneo(profesional.idusuarioProfesional)}>
                      Banear
                    </button>
                  ) : (
                    <button className="btn-desbloqueo-prof" onClick={() => handleDesbloqueo(profesional.idusuarioProfesional)}>
                      Desbloquear
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">No hay profesionales disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManejoProfesionales;
