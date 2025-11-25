import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './estilos/ManejoProfesionales.css';

const ManejoProfesionales = () => {
  const [profesionales, setProfesionales] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/profesional')
      .then((response) => {
        console.log(response);
        setProfesionales(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleBaneo = (id) => {
    axios.put(`http://localhost:3000/profesional/${id}/baneo`)
      .then((response) => {
        console.log(response);
        setProfesionales(profesionales.map((profesional) => {
          if (profesional.idprofesional === id) {
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
    axios.put(`http://localhost:3000/profesional/${id}/desbloqueo`)
      .then((response) => {
        console.log(response);
        setProfesionales(profesionales.map((profesional) => {
          if (profesional.idprofesional === id) {
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
          {Array.isArray(profesionales) && profesionales.map((profesional) => (
            <tr key={profesional.idprofesional}>
              <td>{profesional.idprofesional}</td>
              <td>{profesional.nombre}</td>
              <td>{profesional.apellido}</td>
              <td>{profesional.email}</td>
              <td>{profesional.tipo}</td>
              <td>{profesional.telefono}</td>
              <td>{profesional.direccion}</td>
              <td>{profesional.fechaNacimiento}</td>
              <td>
                {profesional.avatar && <img src={profesional.avatar} alt="Avatar" width="50" height="50" />}
              </td>
              <td className={profesional.estadoCuenta ? 'activo' : 'bloqueado'}>{profesional.estadoCuenta ? 'Activo' : 'Bloqueado'}</td>
              <td>
                {profesional.estadoCuenta ? (
                  <button onClick={() => handleBaneo(profesional.idprofesional)}>Banear</button>
                ) : (
                  <button onClick={() => handleDesbloqueo(profesional.idprofesional)}>Desbloquear</button>
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
