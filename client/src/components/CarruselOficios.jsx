import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./estilos/CarruselOficios.css";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const GAP = 24;

const CarruselOficios = () => {
  const [oficios, setOficios] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const sliderRef = useRef(null);
  const viewportRef = useRef(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/oficios`)
      .then((response) => {
        // Agregamos fallback a la url de cada oficio
        const dataWithFallback = response.data.map((oficio) => ({
          ...oficio,
          urlImagen: oficio.urlImagen || "/assets/images/default-oficio.png",
        }));
        setOficios(dataWithFallback);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleClick = (idOficios) => {
    navigate(`/oficios/${idOficios}`);
  };

  const getCardWidth = () => {
    const el = document.querySelector(".oficio-card");
    return el ? el.offsetWidth : 0;
  };

  const handleSiguienteClick = () => {
    const cardWidth = getCardWidth();
    const sliderWidth = oficios.length * (cardWidth + GAP) - GAP;
    const viewportWidth = viewportRef.current?.offsetWidth || 0;
    const maxTranslate = sliderWidth - viewportWidth;
    const newIndex = currentIndex + 1;
    const newTranslate = newIndex * (cardWidth + GAP);

    if (newTranslate > maxTranslate) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(newIndex);
    }
  };

  const handleAnteriorClick = () => {
    const cardWidth = getCardWidth();
    const viewportWidth = viewportRef.current?.offsetWidth || 0;
    const sliderWidth = oficios.length * (cardWidth + GAP) - GAP;
    const maxTranslate = sliderWidth - viewportWidth;

    if (currentIndex === 0) {
      const lastIndex = Math.floor(maxTranslate / (cardWidth + GAP));
      setCurrentIndex(lastIndex);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="carrusel-wrapper">
      <div className="carrusel-header">
        <button className="btn-carrusel" onClick={handleAnteriorClick}>
          &#60;
        </button>

        <h2 className="titulo-carrusel">Oficios</h2>

        <button className="btn-carrusel" onClick={handleSiguienteClick}>
          &#62;
        </button>
      </div>

      <div className="oficio-viewport" ref={viewportRef}>
        <div
          className="oficio-slider"
          ref={sliderRef}
          style={{
            transform: `translateX(-${
              currentIndex * (getCardWidth() + GAP)
            }px)`,
          }}
        >
          {oficios.map((oficio) => (
            <article
              key={oficio.idOficios}
              className="oficio-card"
              onClick={() => handleClick(oficio.idOficios)}
            >
              <div className="oficio-img-container">
                <img src={oficio.urlImagen} alt={oficio.nombre} />
              </div>

              <h3 className="oficio-nombre">{oficio.nombre}</h3>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarruselOficios;
