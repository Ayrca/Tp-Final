import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './estilos/ManejoProfesionales.css';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const ManejoProfesionales = () => {
  const [profesionales, setProfesionales] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/profesional`)
      .then((response) => {
        console.log(response.data);
        setProfesionales(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleBaneo = (id) => {
    axios.put(`${BASE_URL}//profesional/${id}/baneo`)
      .then((response) => {
        console.log(response);
        setProfesionales(profesionales.map((profesional) => {
          if (profesional.idusuarioProfesional === id) {
            return { ...profesional, estadoCuenta: 0 };
          }
          return profesional;
        }));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDesbloqueo = (id) => {
    axios.put(`${BASE_URL}//profesional/${id}/desbloqueo`)
      .then((response) => {
        console.log(response);
        setProfesionales(profesionales.map((profesional) => {
          if (profesional.idusuarioProfesional === id) {
            return { ...profesional, estadoCuenta: 1 };
          }
          return profesional;
        }));
      })
      .catch((error) => {
        console.error(error);
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
          {Array.isArray(profesionales) && profesionales.map((profesional, index) => (
            <tr key={profesional.idusuarioProfesional || index}>
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
              <td>
                <img
                  src={
                    profesional.avatar
                      ? profesional.avatar.startsWith('http')
                        ? profesional.avatar
                        : `${BASE_URL}${profesional.avatar}` // URL completa
                      : '/assets/images/avatar-de-usuario.png' // imagen por defecto
                  }
                  alt="Avatar"
                  width="50"
                  height="50"
                />
              </td>              </td>
              <td className={profesional.estadoCuenta ? 'activo' : 'bloqueado'}>{profesional.estadoCuenta ? 'Activo' : 'Bloqueado'}</td>
              <td>
                {profesional.estadoCuenta ? (
                  <button className="btn-baneo-prof" onClick={() => handleBaneo(profesional.idusuarioProfesional)}>Banear</button>
                ) : (
                  <button className="btn-desbloqueo-prof" onClick={() => handleDesbloqueo(profesional.idusuarioProfesional)}>Desbloquear</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManejoProfesionales;
