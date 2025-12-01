import './estilos/PerUsuario.css';
import DatosPersonales from './DatosPersonales';
import ImagenesProf from './ImagenesProf';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TrabajosContratados from './TrabajosContratados';
import PerfilAdmin from './PerfilAdmin';
import Swal from 'sweetalert2';

const PerfilUsuario = () => {
  const [usuario, setUsuario] = useState({});
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get("http://localhost:3000/auth/perfil", {                                 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log('Datos del usuario:', response.data);
        setUsuario(response.data);
      })
      .catch((error) => {
        console.error('Error al cargar datos del usuario:', error);
      });
    } else {
      console.log('No hay token');
    }
  }, []);

  const handleGuardarCambios = async (datosActualizados) => {
    try {
      const token = localStorage.getItem('token');
      let response;
      if (usuario.tipo === 'profesional') {
        response = await axios.put(
          "http://localhost:3000/profesional",
          datosActualizados,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Eliminar campos que no existen en la entidad Usuario
        const datosActualizadosUsuario = { ...datosActualizados };
        delete datosActualizadosUsuario.oficio;
        delete datosActualizadosUsuario.empresa;
        delete datosActualizadosUsuario.descripcion;
         response = await axios.put(`http://localhost:3000/usuario/${usuario.idusuarioComun}`,   
           datosActualizadosUsuario,   
        {                                                                        
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      }
      console.log('Datos guardados con éxito:', response.data);
      setUsuario(response.data);
      setEditando(false);
    } catch (error) {
      console.error('Error al guardar datos:', error.response);
    }
  };
  const handleCancelar = () => {
    setEditando(false);
  };

 if (usuario.tipo === 'admin') {
    return <PerfilAdmin />;
    }

const handleAvatarChange = async (event) => {
  try {
    const file = event.target.files[0];
    console.log("dato de file" + file);
    if (!file) {
      console.error('No se ha seleccionado un archivo');
      Swal.fire({
        title: 'Error',
        text: 'No se ha seleccionado un archivo',
        icon: 'error',
        timer: 2000,
      });
      return;
    }
    const formData = new FormData();
    formData.append('avatar', file);
    const token = localStorage.getItem('token');
    let tipoUsuario;
    if (usuario.tipo === 'profesional') {
      tipoUsuario = 'profesional';
    }
    else {
      tipoUsuario = 'Cliente';
    }
    const idUsuario = usuario.tipo === 'profesional' ? usuario.idusuarioProfesional : usuario.idusuarioComun;
    console.log('tipoUsuario:', tipoUsuario);
    console.log("dato de file" + file);
    const response = await axios.post(`http://localhost:3000/avatar/subir/${idUsuario}/${tipoUsuario}`, formData, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log(response.data);
    setUsuario({ ...usuario, avatar: response.data.avatar });
  } catch (error) {
    console.error(error);
    if (error.response && error.response.data && error.response.data.message) {
    Swal.fire({
  title: 'Error',
  text: 'Error al subir el archivo: ' + error.response.data.message,
  icon: 'error',
  timer: 2000,
});
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Error al subir el archivo',
        icon: 'error',
        timer: 2000,
      });
    }
  }
};

  if (usuario.tipo === 'admin') return <PerfilAdmin />;

  return (
    <main className="perfil-wrapper">
      <section className="perfil-card">

        {/* Avatar + Nombre */}
        <div className="perfil-header">
          <div className="avatar-container">
            <img src={usuario.avatar} alt="Avatar" className="avatar-img" />
            <input
              type="file"
              id="avatar-input"
              accept="image/*"
              onChange={handleAvatarChange}
              hidden
            />
            <label htmlFor="avatar-input" className="cambiar-avatar">+</label>
          </div>

          <div className="perfil-title">
            <h2>Mi Perfil</h2>
            <p className="perfil-tipo">
              {usuario.tipo === 'profesional'
                ? 'Profesional'
                : 'Usuario Cliente'}
            </p>
          </div>
        </div>

        {/* Datos personales */}
        <div className="perfil-section">
          <DatosPersonales
            usuario={usuario}
            editando={editando}
            handleGuardarCambios={handleGuardarCambios}
            handleCancelar={() => setEditando(false)}
            setEditando={setEditando}
          />
        </div>

        {/* Galería profesional */}
        {usuario.tipo === 'profesional' && usuario.idusuarioProfesional && (
          <div className="perfil-section">
            <h3 className="section-title">Galería de trabajos</h3>
            <ImagenesProf idProfesional={usuario.idusuarioProfesional} />
          </div>
        )}

        {/* Trabajos realizados */}
        <div className="perfil-section">
          <h3 className="section-title">Trabajos contratados</h3>
          <TrabajosContratados
            idProfesional={usuario.idusuarioProfesional}
            idusuarioComun={usuario.idusuarioComun}
          />
        </div>
      </section>
    </main>
  );
};

export default PerfilUsuario;