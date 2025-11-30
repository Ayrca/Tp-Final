import React, { useState, useEffect } from 'react';
import './estilos/PerfilAdmin.css';
import axios from 'axios';
import ManejoPublicidad from './ManejoPublicidad';
import ManejoOficios from './ManejoOficios';
import ManejoUsuarios from './ManejoUsuarios';
import ManejoProfesionales from './ManejoProfesionales';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const PerfilAdmin = () => {
  const [admin, setAdmin] = useState({});
  const [mostrarPublicidad, setMostrarPublicidad] = useState(false);
  const [mostrarOficios, setMostrarOficios] = useState(false);
  const [mostrarUsuarios, setMostrarUsuarios] = useState(false);
  const [mostrarProfesionales, setMostrarProfesionales] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${BASE_URL}/auth/perfil`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
        .then((response) => {
          setAdmin(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

 const cargarPublicidad = () => {
    setMostrarPublicidad(!mostrarPublicidad);
    setMostrarOficios(false);
    setMostrarUsuarios(false);
    setMostrarProfesionales(false);
  };

  const cargarOficios = () => {
    setMostrarOficios(!mostrarOficios);
    setMostrarPublicidad(false);
    setMostrarUsuarios(false);
    setMostrarProfesionales(false);
  };

  const cargarUsuarios = () => {
    setMostrarUsuarios(!mostrarUsuarios);
    setMostrarPublicidad(false);
    setMostrarOficios(false);
    setMostrarProfesionales(false);
  };

  const cargarProfesionales = () => {
    setMostrarProfesionales(!mostrarProfesionales);
    setMostrarPublicidad(false);
    setMostrarOficios(false);
    setMostrarUsuarios(false);
  };  

  return (
    <div className="perfil-admin-container">
      <div className='datosAdmin'>
        <h1>Perfil de Administrador</h1>
        <p>Nombre: {admin.nombre}</p>
        <p>Apellido: {admin.apellido}</p>
        <p>Email: {admin.email}</p>
      </div>
      <div className="botones-admin">
        <button className="boton-admin" onClick={cargarPublicidad}>
          Manejo de Publicidad
        </button>
        <button className="boton-admin" onClick={cargarOficios}>
          Manejo de Oficios
        </button>
        <button className="boton-admin" onClick={cargarUsuarios}>
          Manejo de Usuarios
        </button>
        <button className="boton-admin" onClick={cargarProfesionales}>
          Manejo de Profesionales
        </button>
      </div>
      {mostrarPublicidad && (
        <ManejoPublicidad />
      )}
      {mostrarOficios && (
        <ManejoOficios />
      )}
      {mostrarUsuarios && (
        <ManejoUsuarios />
      )}
      {mostrarProfesionales && (
        <ManejoProfesionales />
      )}
    </div>
  );
};

export default PerfilAdmin;