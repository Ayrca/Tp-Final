import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './estilos/ImagenesProf.css';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const ImagenesProf = ({ idProfesional }) => {
  const [imagenes, setImagenes] = useState([]);
  const [file, setFile] = useState(null);
  const [reload, setReload] = useState(false); // <- nuevo estado para recargar

  // PAGINACIÓN
  const [paginaActual, setPaginaActual] = useState(1);
  const imagenesPorPagina = 9;

  const indexUltima = paginaActual * imagenesPorPagina;
  const indexPrimera = indexUltima - imagenesPorPagina;
  const imagenesPagina = imagenes.slice(indexPrimera, indexUltima);
  const totalPaginas = Math.ceil(imagenes.length / imagenesPorPagina);

  // Traer imágenes
  useEffect(() => {
    if (!idProfesional) return;

    axios.get(`${BASE_URL}/imagen/${idProfesional}`)
      .then((response) => setImagenes(response.data))
      .catch((error) => console.error(error));
  }, [idProfesional, reload]); // <- reload dispara fetch nuevamente

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!file) return;

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    axios.post(`${BASE_URL}/imagen/upload/${idProfesional}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      }
    })
    .then((response) => {
      setFile(null); // limpiar input
      document.getElementById('file-input').value = ''; // reset input
      setReload(prev => !prev); // fuerza recargar imágenes desde API
    })
    .catch((error) => {
      console.error('Error al subir imagen:', error);
    });
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <div className='cajaImagenes'>
      <h3>Imágenes de Trabajos anteriores</h3>

      <div className="imagenes-container">
        {imagenesPagina.map((imagen, index) => (
          <img key={index} src={imagen.url} alt="Imagen" />
        ))}
      </div>

      {/* PAGINACIÓN */}
      {totalPaginas > 1 && (
        <div className="paginacion">
          <button disabled={paginaActual === 1} onClick={() => setPaginaActual(paginaActual - 1)}>
            Anterior
          </button>

          <button disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual(paginaActual + 1)}>
            Siguiente
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input type="file" id="file-input" accept="image/*" onChange={handleFileChange} />
        <button type="submit" id="agregar-imagen">Agregar imagen</button>
      </form>
    </div>
  );
};

export default ImagenesProf;