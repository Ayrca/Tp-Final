import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './estilos/ImagenesProf.css';
import Swal from 'sweetalert2';

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

  // Obtener imágenes del backend
  useEffect(() => {
    if (!idProfesional) return;

    axios.get(`${BASE_URL}/imagen/${idProfesional}`)
      .then((response) => setImagenes(response.data.reverse()))
      .catch((error) => console.error(error));
  }, [idProfesional, reload]);

  // Subir imagen al backend
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes estar logueado para subir imágenes');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `${BASE_URL}/imagen/upload/${idProfesional}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Imagen subida:', response.data);
      setFile(null);
      document.getElementById('file-input').value = '';
      setReload(prev => !prev);
    } catch (error) {
      console.error('Error al subir imagen:', error);
      alert('Ocurrió un error al subir la imagen');
    }
  };

  // Eliminar imagen
const handleEliminar = async (idImagen) => {
  const token = localStorage.getItem('token');
  if (!token) {
    Swal.fire('Error', 'Debes estar logueado para eliminar imágenes', 'error');
    return;
  }

  // Confirmación con SweetAlert
  const result = await Swal.fire({
    title: '¿Deseas eliminar esta imagen?',
    text: "¡Esta acción no se puede deshacer!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (!result.isConfirmed) return; 

  try {
    await axios.delete(`${BASE_URL}/imagen/${idImagen}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setReload(prev => !prev);

    Swal.fire('Eliminada', 'La imagen se eliminó correctamente', 'success');
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    Swal.fire('Error', 'No se pudo eliminar la imagen', 'error');
  }
};

  const cambiarPagina = (nueva) => {
    setFadeImagenes("fade-out"); 
    setTimeout(() => {
      setPaginaActual(nueva);     
      setFadeImagenes("fade-in"); 
    }, 300);
  };

        const handleVerImagen = (url) => {
        Swal.fire({
          imageUrl: url,
          imageAlt: 'Imagen completa',
          showConfirmButton: false,
          showCloseButton: true,
          width: '80%',
          background: '#000',
        });
      };

  return (
    <div className='cajaImagenes'>
      <h3>Imágenes de Trabajos anteriores</h3>

      <div className={`imagenes-container ${fadeImagenes}`}>
        {imagenesPagina.map((imagen, index) => (
          <div className="imagen-wrapper" key={index}>
          <img
            src={imagen.url}
            alt="Imagen"
            onClick={() => handleVerImagen(imagen.url)}
            style={{ cursor: 'pointer' }}
            />
            <button
              className="btn-eliminar"
              onClick={() => handleEliminar(imagen.idImagen)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

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