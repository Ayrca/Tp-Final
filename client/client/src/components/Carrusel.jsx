import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./estilos/CarruselPublicidad.css";

const CarruselPropaganda = () => {
  const [publicidad, setPublicidad] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const itemsPerView = 2; // mostramos SIEMPRE 2 publicidades
  const autoSlideRef = useRef(null);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

useEffect(() => {
  axios
    .get("http://localhost:3000/publicidad")
    .then((res) => {
      setPublicidad(res.data);
    })
    .catch((err) => console.error(err));
}, []);


  const totalItems = publicidad.length;

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

  const nextSlide = (reset = true) => {
    if (reset) stopAutoSlide();

    setCurrentSlide((prev) =>
    prev + 1 >= totalItems - itemsPerView + 1 ? 0 : prev + 1
    );

    if (reset) startAutoSlide();
  };

  const prevSlide = (reset = true) => {
    if (reset) stopAutoSlide();

    setCurrentSlide((prev) =>
    prev === 0 ? totalItems - itemsPerView : prev - 1
    );

    if (reset) startAutoSlide();
  };

  // TOUCH
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
      diff > 0 ? nextSlide(false) : prevSlide(false);
    }
    startAutoSlide();
  };

  // MOUSE SWIPE
  const onMouseDown = (e) => {
    stopAutoSlide();
    touchStartX.current = e.clientX;
  };

  const onMouseUp = (e) => {
    touchEndX.current = e.clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      diff > 0 ? nextSlide(false) : prevSlide(false);
    }
    startAutoSlide();
  };

  return (
    <div
      className="propaganda-wrapper"
      onMouseEnter={stopAutoSlide}
      onMouseLeave={startAutoSlide}
    >
      {/* BOTONES */}
      {publicidad.length > itemsPerView && (
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
            style={{
              transform: `translateX(-${currentSlide * 50}%)`, // mueve 50% por item
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
              onClick={() =>
                item.urlPagina && window.open(item.urlPagina, "_blank")
              }
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
