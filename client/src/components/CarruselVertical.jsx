import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./estilos/CarruselVertical.css";

const CarruselVertical = () => {
  const [publicidad, setPublicidad] = useState([]);
  const wrapperRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/publicidad")
      .then((res) => {
        const data = res.data || [];
        // 🔥 duplicamos y triplicamos para que el scroll sea continuo
        setPublicidad([...data, ...data, ...data]);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let position = 0;

    const speed = 0.2; // 🔥 velocidad ultra suave (más chico = más suave)
    
    const animate = () => {
      position += speed;
      wrapper.style.transform = `translateY(-${position}px)`;

      // Reinicia cuando llega a la mitad del contenido real (por triplicación)
      if (position >= wrapper.scrollHeight / 3) {
        position = 0;
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [publicidad]);

        return (
        <div className="carrusel-vertical-container">
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
