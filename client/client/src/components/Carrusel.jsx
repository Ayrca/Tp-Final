import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './estilos/CarruselPublicidad.css';

const CarruselPropaganda = () => {
  const [publicidad, setPublicidad] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  const autoSlideRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const trackRef = useRef(null);

  // ==============================
  //  CARGA DE PUBLICIDAD
  // ==============================
  useEffect(() => {
    axios
      .get('http://localhost:3000/publicidad')
      .then((response) => setPublicidad(response.data))
      .catch((error) => console.error(error));
  }, []);

  // ==============================
  //  RESPONSIVE ITEMS PER VIEW
  // ==============================
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth <= 600) setItemsPerView(1);
      else if (window.innerWidth <= 900) setItemsPerView(2);
      else setItemsPerView(3);
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  // ==============================
  //  AUTO-SLIDE
  // ==============================
  const startAutoSlide = () => {
    stopAutoSlide();
    autoSlideRef.current = setInterval(() => {
      nextSlide(false);
    }, 3000);
  };

  const stopAutoSlide = () => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
  };

  useEffect(() => {
    if (publicidad.length > 1) startAutoSlide();
    return stopAutoSlide;
  }, [publicidad]);

  // ==============================
  //  CONTROLES MANUALES
  // ==============================
  const nextSlide = (resetAuto = true) => {
    if (resetAuto) stopAutoSlide();

    setCurrentSlide((prev) =>
      (prev + 1) % publicidad.length
    );

    if (resetAuto) startAutoSlide();
  };

  const prevSlide = (resetAuto = true) => {
    if (resetAuto) stopAutoSlide();

    setCurrentSlide((prev) =>
      (prev - 1 + publicidad.length) % publicidad.length
    );

    if (resetAuto) startAutoSlide();
  };

  // ==============================
  //  SWIPE PARA CELULAR / MOUSE
  // ==============================
  const onTouchStart = (e) => {
    stopAutoSlide();
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide(false);   // swipe izquierda → next
      else prevSlide(false);            // swipe derecha → prev
    }

    startAutoSlide();
  };

  // Soporte swipe con mouse para PC
  const onMouseDown = (e) => {
    stopAutoSlide();
    touchStartX.current = e.clientX;
  };

  const onMouseUp = (e) => {
    touchEndX.current = e.clientX;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide(false);
      else prevSlide(false);
    }
    startAutoSlide();
  };

  const slideWidth = 100 / itemsPerView;

  return (
    <div className="propaganda-wrapper">

      {/* Botones de navegación */}
      {publicidad.length > 1 && (
        <>
          <button className="nav-btn prev" onClick={() => prevSlide()}>
            ‹
          </button>
          <button className="nav-btn next" onClick={() => nextSlide()}>
            ›
          </button>
        </>
      )}

      <div className="propaganda-container">

        <div
          className="propaganda-track"
          ref={trackRef}
          style={{
            transform: `translateX(-${currentSlide * slideWidth}%)`,
            width: `${(publicidad.length * 100) / itemsPerView}%`,
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
        >
          {publicidad.map((item, index) => (
            <article
              key={index}
              className="propaganda-item"
              style={{ width: `${slideWidth}%` }}
              onClick={() => item.urlPagina && window.open(item.urlPagina, '_blank')}
            >
              <h2 className="propaganda-title">{item.titulo}</h2>
              <img
                src={item.urlImagen}
                alt={item.titulo}
                className="propaganda-img"
              />
            </article>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CarruselPropaganda;
