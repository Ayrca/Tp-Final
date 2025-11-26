import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CarruselPropaganda = () => {
  const [publicidad, setPublicidad] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
     axios.get('http://localhost:3000/publicidad')                            
      .then(response => setPublicidad(response.data))
      .catch(error => console.error(error));
  }, []);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlide((currentSlide + 1) % publicidad.length);
    }, 3000);
    return () => clearInterval(intervalId);
  }, [currentSlide, publicidad]);
  const handleClick = (url) => {
    window.open(url, '_blank');
  };
  return (
    <div className="propaganda-container" id="propaganda1">
      {publicidad.map((publicidad, index) => (
        <article
          key={index}
          className="propaganda2"
          data-url={publicidad.urlPagina}
          onClick={() => handleClick(publicidad.urlPagina)}
          style={{
            transform: `translateX(${(index - currentSlide) * 100}%)`,
            transition: 'transform 0.5s',
          }}
        >
          <h2>{publicidad.titulo}</h2>
          <img src={publicidad.urlImagen} alt={publicidad.titulo} />
        </article>
      ))}
    </div>
  );
};
export default CarruselPropaganda;
