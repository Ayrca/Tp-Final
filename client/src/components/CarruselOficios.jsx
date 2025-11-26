
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './estilos/CarruselOficios.css'; 
import { useNavigate } from 'react-router-dom';

const CarruselOficios = () => {
  const [oficios, setOficios] = useState([]);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get('http://localhost:3000/oficios')
      .then(response => setOficios(response.data))
      .catch(error => console.error(error));
  }, []);
  const handleClick = (idOficios) => {
    navigate(`/oficios/${idOficios}`);
  };
  const handleAnteriorClick = () => {
    containerRef.current.scrollLeft -= 500;
  };
  const handleSiguienteClick = () => {
    containerRef.current.scrollLeft += 500;
  };
  return (
    <div>
      <div className="oficio-container" id="oficio-container" ref={containerRef}>
        {oficios.map((oficio, index) => (
          <article key={index} className="oficio-item" onClick={() => handleClick(oficio.idOficios)}>
            <a className="Acard">
              <button className="btnIndexcard">
                <img src={oficio.urlImagen} alt={oficio.nombre} />
              </button>
              <h2>{oficio.nombre}</h2>
            </a>
          </article>
        ))}
      </div>
      <div className="cajaBtn1">
        <button id="anterior1" onClick={handleAnteriorClick}>&#60; </button>
        <h2 className="catalogoCartel">Oficios</h2>
        <button id="siguiente1" onClick={handleSiguienteClick}>&#62;</button>
      </div>
    </div>
  );
};
export default CarruselOficios;