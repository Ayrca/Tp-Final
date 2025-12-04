import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './estilos/ManejoUsuarios.css';
import Swal from 'sweetalert2';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const ManejoUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/usuario`)
      .then((response) => setUsuarios(response.data))
      .catch((error) => console.error('Error al traer usuarios:', error));
  }, []);

  const handleBaneo = (id) => {
    Swal.fire({
      title: '¿Estás seguro de banear a este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, banear',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.put(`${BASE_URL}/usuario/${id}/baneo`)
          .then(() => {
            setUsuarios(usuarios.map((usuario) =>
              usuario.idusuarioComun === id
                ? { ...usuario, estadoCuenta: false }
                : usuario
            ));
            Swal.fire('Usuario baneado', '', 'success');
          })
          .catch((error) => {
            console.error('Error al banear usuario:', error);
            Swal.fire('Error', 'No se pudo banear al usuario', 'error');
          });
      }
    });
  };

  const handleDesbloqueo = (id) => {
    Swal.fire({
      title: '¿Estás seguro de desbloquear a este usuario?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, desbloquear',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.put(`${BASE_URL}/usuario/${id}/desbloqueo`)
          .then(() => {
            setUsuarios(usuarios.map((usuario) =>
              usuario.idusuarioComun === id
                ? { ...usuario, estadoCuenta: true }
                : usuario
            ));
            Swal.fire('Usuario desbloqueado', '', 'success');
          })
          .catch((error) => {
            console.error('Error al desbloquear usuario:', error);
            Swal.fire('Error', 'No se pudo desbloquear al usuario', 'error');
          });
      }
    });
  };

  return (
    <div className="manejo-usuarios">
      <table className="tabla-usuarios">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Tipo</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Fecha Nacimiento</th>
            <th>Avatar</th>
            <th>Estado Cuenta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length > 0 ? (
            usuarios.map((usuario) => (
              <tr key={usuario.idusuarioComun}>
                <td>{usuario.idusuarioComun}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.apellido}</td>
                <td>{usuario.email}</td>
                <td>{usuario.tipo}</td>
                <td>{usuario.telefono}</td>
                <td>{usuario.direccion}</td>
                <td>
                  {usuario.fechaNacimiento
                    ? new Date(usuario.fechaNacimiento).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })
                    : ''}
                </td>
                <td>
                  <img
                    src={
                      usuario.avatar
                        ? usuario.avatar.startsWith('http')
                          ? usuario.avatar
                          : `/assets/images/avatar-de-usuario.png`
                        : '/assets/images/avatar-de-usuario.png'
                    }
                    alt="Avatar"
                    width="50"
                    height="50"
                  />
                </td>
                <td className={usuario.estadoCuenta ? 'activo' : 'bloqueado'}>
                  {usuario.estadoCuenta ? 'Activo' : 'Bloqueado'}
                </td>
                <td>
                  {usuario.estadoCuenta ? (
                    <button className="btn-baneo-usuarios" onClick={() => handleBaneo(usuario.idusuarioComun)}>
                      Banear
                    </button>
                  ) : (
                    <button className="btn-desbloqueo-usuarios" onClick={() => handleDesbloqueo(usuario.idusuarioComun)}>
                      Desbloquear
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11">No hay usuarios disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManejoUsuarios;