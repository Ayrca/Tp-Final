
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Carrusel from '../components/Carrusel';
import './estilos/ListaProfesionales.css'; // Importa el archivo CSS
import Swal from 'sweetalert2';

const getIdUsuarioLogueado = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const decodedToken = jwtDecode(token);
  console.log('ID del usuario logueado:', decodedToken.sub);
  return decodedToken.sub;
};

/*
const useOficio = (idOficios) => {
  const [oficio, setOficio] = useState(null);
  useEffect(() => {
    axios.get(`http://localhost:3000/oficio/${idOficios}`)
      .then(response => {
        setOficio(response.data.nombre); // Devuelve solo el nombre del oficio
      })
      .catch(error => {
        console.error(error);
      });
  }, [idOficios]);
  return oficio;
};
*/

const ListaProfesional = () => {
  const { id } = useParams();
 // const { idOficios } = useParams();
  const [profesionales, setProfesionales] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const idusuarioComun = getIdUsuarioLogueado();
  const [idOficios, setIdOficios] = useState(null);
  //const oficio = useOficio(idOficios);

  const obtenerOficio = async (idProfesional) => {
  try {
    const response = await axios.get(`http://localhost:3000/profesional/${idProfesional}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener oficio:', error);
    return null; // Agrega esto para evitar el error
  }
}


useEffect(() => {
  let url = 'http://localhost:3000/profesional';                                 
  if (id) {
    url += `/oficio/${id}`;
    setIdOficios(id);
  }
  axios.get(url)
    .then(response => {
      console.log('Respuesta de la API:', response.data);
      setProfesionales(response.data);
      setCargando(false);
    })
    .catch(error => {
      setError(error);
      setCargando(false);
    });
}, [id]);



const handleContratar = useCallback(async (profesional) => {
  if (!idusuarioComun) {
    Swal.fire({
      title: 'Error',
      text: 'Debe estar logueado para contratar',
      icon: 'error',
    });
    return;
  }
  if (idusuarioComun === profesional.idusuarioProfesional) {
    Swal.fire({
      title: 'Error',
      text: 'Los profesionales no pueden contratar',
      icon: 'error',
    });
    return;
  }
  try {
    // Obtener los datos del usuario logueado
    const response = await axios.get("http://localhost:3000/usuario/" + idusuarioComun);                                                 
    console.log('Respuesta de la API:', response);
    const usuarioLogueado = response.data;
    console.log('Datos del usuario logueado:', usuarioLogueado);
    console.log('Datos del profesional:', profesional);
    const oficio = await obtenerOficio(profesional.idusuarioProfesional);
    console.log('Oficio:', oficio);
    console.log('Oficio del profesional:', oficio);
   
    const datosContratacion = {
      usuarioComun: { idusuarioComun: idusuarioComun },
      profesional: { idusuarioProfesional: profesional.idusuarioProfesional },
      rubro: oficio.oficio.nombre,
      telefonoProfesional: profesional.telefono,
      telefonoCliente: usuarioLogueado.telefono,
      estado: "pendiente",
      valoracion: 0,
      comentario: '',
      fechaContratacion: new Date(),
    };
    console.log('Oficio del profesional:', profesional.oficio);
    console.log('Datos de contratación:', datosContratacion);
    axios.post("http://localhost:3000/trabajoContratado", datosContratacion)
      .then(response => {
        console.log(response);
        Swal.fire({
          title: 'Éxito',
          text: 'La solicitud de contrato se ha enviado correctamente',
          icon: 'success',
        });
      })
      .catch(error => {
        console.error(error);
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al procesar la solicitud',
          icon: 'error',
        });
      });
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: 'Ocurrió un error al procesar la solicitud',
      icon: 'error',
    });
  }
}, [idusuarioComun, idOficios]);

const handleConectar = async (profesional) => {
  if (!idusuarioComun) {
    Swal.fire({
      title: 'Error',
      text: 'Debe estar logueado para contactar',
      icon: 'error',
    });
    return;
  }
  const usuarioLogueado = jwtDecode(localStorage.getItem('token'));
  if (usuarioLogueado.tipo === 'profesional') {
    Swal.fire({
      title: 'Error',
      text: 'Los profesionales no pueden contactar a otros profesionales',
      icon: 'error',
    });
   return;
  }
  try {
    const telefono = profesional.telefono;
    const response = await axios.get("http://localhost:3000/usuario/" + idusuarioComun);
    const usuarioLogueado = response.data;
    const mensaje = `Hola ${profesional.nombre}, soy ${usuarioLogueado.nombre} ${usuarioLogueado.apellido} estoy intentando comunicarme desde la app Tu Oficio para hacerte una consulta.`;
    const url = `https://wa.me/${telefono}?text=${mensaje}`;
    window.open(url, '_blank');
  } catch (error) {
    console.error(error);
    Swal.fire({
      title: 'Error',
      text: 'Ocurrió un error al procesar la solicitud',
      icon: 'error',
    });
  }
};


  if (cargando) {
    return <p>Cargando...</p>;
  }
  if (error) {
    return <p>Error: {error.message}</p>;
  }

  console.log(profesionales); // Verifica la variable profesionales

  return (
    <div className="profesionales-container">
      <Carrusel/>
      {profesionales.length === 0 ? (
        <p>No hay Profesionales disponibles</p>
      ) : (
        profesionales.map((profesional, index) => (
          <article key={index} className="profesional-item">
            <div className="infoContainer">
              <img src={profesional.avatar || 'ruta-por-defecto.jpg'} alt={profesional.nombre} />
              <div className="profesional-data">
                <div className="profesional-header">
                  <h2>{profesional.nombre} {profesional.apellido}.</h2>
                  <label className={profesional.estado ? 'disponible' : 'no-disponible'}>
                    {profesional.estado ? 'Disponible' : 'No Disponible'}
                  </label>
                </div>
                <div className="datosContainer">
                  <h2>{profesional.empresa}.</h2>
                  <p>Email: {profesional.email}</p>
                  <p>Tel: {profesional.telefono}</p>
                  <p>Dirección: {profesional.direccion}</p>
                  <p>Valoración promedio: {profesional.valoracion}</p>
                  <p>Fecha Nacimiento: {profesional.fechaNacimiento}</p>
                  <p>Descripcion: {profesional.descripcion}</p>
                </div>
                <div className="profesional-buttons">
                  <Link to={`/profesional/perfil/${profesional.idusuarioProfesional}`} state={{ profesional: profesional }}>
                    <button className="verMas">Ver Más</button>
                  </Link>
                  <button className="conectar" onClick={() => handleConectar(profesional)}> Conectar</button>
                  <button className="contratar" onClick={() => handleContratar(profesional)} disabled={profesional.idProfesional === idusuarioComun}>
                   Contratar</button>
                  
                </div>
              </div>
            </div>
          </article>
        ))
      )}
      <Carrusel/>
    </div>
  );
};
export default ListaProfesional;