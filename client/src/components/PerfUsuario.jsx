import './estilos/PerUsuario.css';
import DatosPersonales from './DatosUsuario';
import ImagenesProf from './ImagenesProf';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TrabajosContratados from './TrabajosContratados';

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
 return (
    <main className="cuenta-container">
      <section className="perfil-usuario">
        <div className="avatar-container">
          <img src={usuario.avatar} alt="Avatar" className="avatar-img" />
          <div className="cambiar-avatar">+</div>
          <input type="file" accept="image/*" hidden />
        </div>
        <div className="info">
          <h2>Mi perfil</h2>
         <DatosPersonales
  usuario={usuario}
  editando={editando}
  handleGuardarCambios={handleGuardarCambios}
  handleCancelar={handleCancelar}
  setEditando={setEditando}
/>
 <h3>Trabajos contratados</h3>
      <div id="trabajos-container">
      <TrabajosContratados idusuarioComun={usuario.idusuarioComun} />
        
      </div>
{usuario.tipo === 'profesional' && usuario.idusuarioProfesional ? (
  <div>
    <section className="galeria" id="galeria-section">
      <ImagenesProf idProfesional={usuario.idusuarioProfesional} />
    </section>
    <section className="trabajos-contratados">
      <h3>Trabajos contratados</h3>
      <div id="trabajos-container">
      <TrabajosContratados idProfesional={usuario.idusuarioProfesional} />
        
      </div>
    </section>
  </div>
) : null}

  </div>
  </section>
    </main>
 
  );
 };
 
export default PerfilUsuario;









