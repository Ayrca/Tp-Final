import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './estilos/ImagenesProf.css';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const ImagenesProf = ({ idProfesional }) => {
  const [imagenes, setImagenes] = useState([]);
  const [file, setFile] = useState(null);
  const [reload, setReload] = useState(false);

  // PAGINACIÓN
  const [paginaActual, setPaginaActual] = useState(1);
  const [fadeImagenes, setFadeImagenes] = useState("fade-in");
  const imagenesPorPagina = 9;

  const indexUltima = paginaActual * imagenesPorPagina;
  const indexPrimera = indexUltima - imagenesPorPagina;
  const imagenesPagina = imagenes.slice(indexPrimera, indexUltima);
  const totalPaginas = Math.ceil(imagenes.length / imagenesPorPagina);

  useEffect(() => {
    if (!idProfesional) return;

    axios.get(`${BASE_URL}/imagen/${idProfesional}`)
      .then((response) => {
        setImagenes(response.data.reverse());
      })
      .catch((error) => console.error(error));
  }, [idProfesional, reload]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return;

    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default'); // tu preset
    formData.append('folder', `profesionales/${idProfesional}`); // opcional

    try {
      // Subida a Cloudinary
      const cloudRes = await axios.post(
        'https://api.cloudinary.com/v1_1/ddadtpm2o/upload',
        formData
      );

      const imageUrl = cloudRes.data.secure_url;

      // Guardar la URL en tu backend
      await axios.post(
        `${BASE_URL}/imagen/upload/${idProfesional}`,
        { url: imageUrl },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setFile(null);
      document.getElementById('file-input').value = '';
      setReload(prev => !prev);
    } catch (error) {
      console.error('Error al subir imagen:', error);
    }
  };

  const cambiarPagina = (nueva) => {
    setFadeImagenes("fade-out"); 
    setTimeout(() => {
      setPaginaActual(nueva);     
      setFadeImagenes("fade-in"); 
    }, 300);
  };

  return (
    <div className='cajaImagenes'>
      <h3>Imágenes de Trabajos anteriores</h3>

      <div className={`imagenes-container ${fadeImagenes}`}>
        {imagenesPagina.map((imagen, index) => (
          <img key={index} src={imagen.url} alt="Imagen" />
        ))}
      </div>

      {/* PAGINACIÓN */}
      {totalPaginas > 1 && (
        <div className="gallery-pagination">
          <button
            className="pag-btn"
            disabled={paginaActual === 1}
            onClick={() => cambiarPagina(paginaActual - 1)}
          >
            ◀
          </button>

          <span className="pag-indicator">
            {paginaActual} / {totalPaginas}
          </span>

          <button
            className="pag-btn"
            disabled={paginaActual === totalPaginas}
            onClick={() => cambiarPagina(paginaActual + 1)}
          >
            ▶
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          id="file-input"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit" id="agregar-imagen">Agregar imagen</button>
      </form>
    </div>
  );
};

export default ImagenesProf;