import './estilos/PerUsuario.css';
import DatosPersonales from './DatosPersonales';
import ImagenesProf from './ImagenesProf';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TrabajosContratados from './TrabajosContratados';
import PerfilAdmin from './PerfilAdmin';
import Swal from 'sweetalert2';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const CLOUDINARY_URL = 'https://res.cloudinary.com/ddadtpm2o/image/upload/';

const PerfUsuario = () => {
  const [usuario, setUsuario] = useState({});
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get(`${BASE_URL}/auth/perfil`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setUsuario(response.data))
        .catch((error) =>
          console.error('Error al cargar datos del usuario:', error)
        );
    }
  }, []);

  const handleGuardarCambios = async (datosActualizados) => {
    try {
      const token = localStorage.getItem('token');
      let response;

      if (usuario.tipo === 'profesional') {
        response = await axios.put(
          `${BASE_URL}/profesional`,
          datosActualizados,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        const datosActualizadosUsuario = { ...datosActualizados };
        delete datosActualizadosUsuario.oficio;
        delete datosActualizadosUsuario.empresa;
        delete datosActualizadosUsuario.descripcion;

        response = await axios.put(
          `${BASE_URL}/usuario/${usuario.idusuarioComun}`,
          datosActualizadosUsuario,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setUsuario(response.data);
      setEditando(false);
    } catch (error) {
      console.error('Error al guardar datos:', error);
    }
  };

  const handleAvatarChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) {
        Swal.fire({
          title: 'Error',
          text: 'No seleccionaste un archivo',
          icon: 'error',
        });
        return;
      }

      const formData = new FormData();
      formData.append('avatar', file);

      const token = localStorage.getItem('token');
      const tipoUsuario =
        usuario.tipo === 'profesional' ? 'profesional' : 'Cliente';

      const idUsuario =
        usuario.tipo === 'profesional'
          ? usuario.idusuarioProfesional
          : usuario.idusuarioComun;

      const response = await axios.post(
        `${BASE_URL}/avatar/subir/${idUsuario}/${tipoUsuario}`,
        formData,
        {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setUsuario({
        ...usuario,
        avatar: response.data.avatar
          ? response.data.avatar.startsWith('http')
            ? response.data.avatar
            : `${CLOUDINARY_URL}${response.data.avatar}`
          : process.env.PUBLIC_URL + '/assets/images/avatar-de-usuario.png',
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo subir el avatar',
        icon: 'error',
      });
    }
  };

  if (usuario.tipo === 'admin') return <PerfilAdmin />;

  return (
    <main className="pu-wrapper">
      <section className="pu-card">

        {/* ==== Avatar + nombre ==== */}
        <div className="pu-header">
          <div className="pu-avatar-box">
            <img
              src={
                usuario.avatar
                  ? usuario.avatar.startsWith('http')
                    ? usuario.avatar
                    : `${CLOUDINARY_URL}${usuario.avatar}`
                  : process.env.PUBLIC_URL + '/assets/images/avatar-de-usuario.png'
              }
              alt="Avatar"
              className="pu-avatar-img"
            />

            <input
              type="file"
              id="pu-avatar-input"
              accept="image/*"
              onChange={handleAvatarChange}
              hidden
            />
            <label htmlFor="pu-avatar-input" className="pu-avatar-btn">
              +
            </label>
          </div>

          <div className="pu-title-box">
            <h2>Mi Perfil</h2>
            <p className="pu-type">
              {usuario.tipo === 'profesional'
                ? 'Profesional'
                : 'Usuario Cliente'}
            </p>
          </div>
        </div>

        {/* ==== Datos personales ==== */}
        <div className="pu-section">
          <DatosPersonales
            usuario={usuario}
            editando={editando}
            handleGuardarCambios={handleGuardarCambios}
            handleCancelar={() => setEditando(false)}
            setEditando={setEditando}
          />
        </div>

        {/* ==== Galería profesional ==== */}
        {usuario.tipo === 'profesional' && usuario.idusuarioProfesional && (
          <div className="pu-section">
            <h3 className="pu-section-title">Galería de trabajos</h3>

            <ImagenesProf
              idProfesional={usuario.idusuarioProfesional}
              filas={3}
              columnas={3}
            />
          </div>
        )}

        {/* ==== Trabajos contratados ==== */}
        <div className="pu-section">
          <h3 className="pu-section-title">Trabajos contratados</h3>

          <TrabajosContratados
            idProfesional={usuario.idusuarioProfesional}
            idusuarioComun={usuario.idusuarioComun}
            filas={3}
            columnas={3}
          />
        </div>
      </section>
    </main>
  );
};

export default PerfUsuario;
