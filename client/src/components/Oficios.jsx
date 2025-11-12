import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './estilos/listaOficios.css';

function Oficios() {
  const [oficios, setOficios] = useState([]);
  const navigate = useNavigate(); // Llama al hook useNavigate aquí

  useEffect(() => {
    axios.get('http://localhost:3000/oficios')
      .then(response => {
        console.log('Datos recibidos:', response.data);
        setOficios(response.data);
      })
      .catch(error => {
        console.error('Error al cargar datos:', error);
      });
  }, []);

  
  const handleClick = (id, nombre) => {
    localStorage.setItem('categoriaId', id);
    localStorage.setItem('categoria', nombre);
    navigate(`/profesional/${id}`);

  };
  return (
    <div className='listaOficios'>
      <h1>Todos los oficios</h1>
      {oficios.length > 0 ? (
        <ul>
          {oficios.map((oficio, index) => (
            <li key={index}>
              <button onClick={() => handleClick(oficio.idOficios, oficio.nombre || oficio.titulo)}>
                {oficio.nombre || oficio.titulo}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay oficios disponibles</p>
      )}
    </div>
  );
}
export default Oficios;
