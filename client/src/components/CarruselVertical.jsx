import React, { useEffect, useState, useRef } from "react";
import "./estilos/CarruselVertical.css";

const CarruselVertical = ({ imagenes }) => {
  const [publicidad, setPublicidad] = useState([]);
  const wrapperRef = useRef(null);

  // Altura fija de cada item
  const ITEM_HEIGHT = 250;

  useEffect(() => {
    if (imagenes?.length) {
      let baseList = [...imagenes];

      // Garantizar mínimo 4 imágenes
      while (baseList.length < 4) {
        baseList = [...baseList, ...imagenes];
      }

      // Para efecto infinito, triplicamos
      const listaFinal = [...baseList, ...baseList, ...baseList];
      setPublicidad(listaFinal);
    }
  }, [imagenes]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let position = 0;
    const speed = 0.2;

    const animate = () => {
      position += speed;
      wrapper.style.transform = `translateY(-${position}px)`;

      if (position >= wrapper.scrollHeight / 3) {
        position = 0;
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [publicidad]);

  return (
    <div
      className="carrusel-vertical-container"
      style={{ height: ITEM_HEIGHT * 4 }} // siempre 4 visibles
    >
      <div className="carrusel-vertical-wrapper" ref={wrapperRef}>
        {publicidad.map((pub, index) => (
          <div
            key={index}
            className="carrusel-vertical-item"
            style={{ height: ITEM_HEIGHT }}
          >
            <a href={pub.urlPagina} target="_blank" rel="noopener noreferrer">
              <img src={pub.urlImagen} alt={pub.titulo} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarruselVertical;