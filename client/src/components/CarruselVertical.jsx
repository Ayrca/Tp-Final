import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./estilos/CarruselVertical.css";

const CarruselVertical = ({ altura, imagenes }) => {
  const [publicidad, setPublicidad] = useState([]);
  const wrapperRef = useRef(null);

  // Usamos las imágenes que vienen por prop
  useEffect(() => {
    if (imagenes?.length) {
      setPublicidad([...imagenes, ...imagenes, ...imagenes]);
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
      style={{ height: altura || '100vh' }}
    >
      <div className="carrusel-vertical-wrapper" ref={wrapperRef}>
        {publicidad.map((pub, index) => (
          <div key={index} className="carrusel-vertical-item">
            <a
              href={pub.urlPagina}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={pub.urlImagen} alt={pub.titulo} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarruselVertical;