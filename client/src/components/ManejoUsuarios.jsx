
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './estilos/ManejoUsuarios.css';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const ManejoUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/usuario`)
      .then((response) => {
        console.log(response);
        setUsuarios(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleBaneo = (id) => {
    axios.put(`${BASE_URL}/usuario/${id}/baneo`)
      .then((response) => {
        console.log(response);
        setUsuarios(usuarios.map((usuario) => {
          if (usuario.idusuarioComun === id) {
            return { ...usuario, estadoCuenta: 0 };
          }
          return usuario;
        }));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDesbloqueo = (id) => {
    axios.put(`${BASE_URL}/usuario/${id}/desbloqueo`)
      .then((response) => {
        console.log(response);
        setUsuarios(usuarios.map((usuario) => {
          if (usuario.idusuarioComun === id) {
            return { ...usuario, estadoCuenta: 1 };
          }
          return usuario;
        }));
      })
      .catch((error) => {
        console.error(error);
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
          {Array.isArray(usuarios) && usuarios.map((usuario) => (
            <tr key={usuario.idusuarioComun}>
              <td>{usuario.idusuarioComun}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.apellido}</td>
              <td>{usuario.email}</td>
              <td>{usuario.tipo}</td>
              <td>{usuario.telefono}</td>
              <td>{usuario.direccion}</td>
              <td>{usuario.fechaNacimiento}</td>
              <td>
              <img
                src={
                  usuario.avatar
                    ? usuario.avatar.startsWith('http')
                      ? usuario.avatar
                      : `${BASE_URL}${usuario.avatar}` // URL completa
                    : '/assets/images/avatar-de-usuario.png' // por defecto
                }
                alt="Avatar"
                width="50"
                height="50"
              />
              </td>
              <td className={usuario.estadoCuenta ? 'activo' : 'bloqueado'}>{usuario.estadoCuenta ? 'Activo' : 'Bloqueado'}</td>
              <td>
                {usuario.estadoCuenta ? (
                  <button onClick={() => handleBaneo(usuario.idusuarioComun)}>Banear</button>
                ) : (
                  <button onClick={() => handleDesbloqueo(usuario.idusuarioComun)}>Desbloquear</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManejoUsuarios;