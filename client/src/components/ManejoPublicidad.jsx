import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './estilos/ManejoPublicidad.css';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const CLOUDINARY_URL = process.env.REACT_APP_CLOUDINARY_URL; // endpoint de Cloudinary

const ManejoPublicidad = () => {
  const [publicidad, setPublicidad] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [urlPagina, setUrlPagina] = useState('');
  const [imagen, setImagen] = useState(null);
  const [editarPublicidad, setEditarPublicidad] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/publicidad`)
      .then((response) => {
        setPublicidad(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const subirImagenCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'publicidad'); // preset de Cloudinary
    const response = await axios.post(CLOUDINARY_URL, formData);
    return response.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imagen) {
      Swal.fire('Error!', 'Debes seleccionar una imagen', 'error');
      return;
    }
    try {
      const urlImagen = await subirImagenCloudinary(imagen);
      const nuevaPublicidad = { titulo, urlPagina, urlImagen };
      const response = await axios.post(`${BASE_URL}/publicidad`, nuevaPublicidad);
      setPublicidad([...publicidad, response.data]);
      Swal.fire('Agregado!', 'La publicidad ha sido agregada', 'success');
      setTitulo('');
      setUrlPagina('');
      setImagen(null);
      setMostrarFormulario(false);
    } catch (error) {
      console.error(error);
      Swal.fire('Error!', 'No se pudo agregar la publicidad', 'error');
    }
  };

  const handleEditar = (item) => {
    setEditarPublicidad(item);
  };

  const handleCancelar = () => {
    setEditarPublicidad(null);
    setImagen(null);
  };

  const handleBorrar = (item) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir este cambio',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${BASE_URL}/publicidad/${item.idpublicidad}`);
          setPublicidad(publicidad.filter((p) => p.idpublicidad !== item.idpublicidad));
          Swal.fire('Borrado!', 'La publicidad ha sido borrada', 'success');
        } catch (error) {
          console.error('Error al borrar publicidad:', error);
          Swal.fire('Error!', 'No se pudo borrar la publicidad', 'error');
        }
      }
    });
  };

  const handleGuardar = async (item) => {
    try {
      let urlImagen = item.urlImagen;
      if (imagen) {
        urlImagen = await subirImagenCloudinary(imagen);
      }
      const dataActualizada = { ...item, urlImagen };
      const response = await axios.put(`${BASE_URL}/publicidad/${item.idpublicidad}`, dataActualizada);
      setPublicidad(publicidad.map((p) => p.idpublicidad === item.idpublicidad ? response.data : p));
      setEditarPublicidad(null);
      setImagen(null);
      Swal.fire('Guardado!', 'La publicidad ha sido actualizada', 'success');
    } catch (error) {
      console.error(error);
      Swal.fire('Error!', 'No se pudo actualizar la publicidad', 'error');
    }
  };

  return (
    <div className="manejo-publicidad">
      <button className="btn-agregar-publicidad" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
        Agregar Publicidad
      </button>
      {mostrarFormulario && (
        <form onSubmit={handleSubmit}>
          <label>Título:</label>
          <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          <br />
          <label>URL de la Página:</label>
          <input type="text" value={urlPagina} onChange={(e) => setUrlPagina(e.target.value)} />
          <br />
          <label>Imagen:</label>
          <input type="file" onChange={(e) => setImagen(e.target.files[0])} />
          <br />
          <button type="submit">Agregar Publicidad</button>
          <button type="button" onClick={() => setMostrarFormulario(false)}>Cancelar</button>
        </form>
      )}
      <table className="tabla-publicidad">
        <thead>
          <tr>
            <th>ID</th>
            <th>URL Imagen</th>
            <th>URL Pagina</th>
            <th>Titulo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {publicidad.map((item) => (
            <tr key={item.idpublicidad}>
              <td>{item.idpublicidad}</td>
              <td>
                {editarPublicidad && editarPublicidad.idpublicidad === item.idpublicidad ? (
                  <div>
                    <input type="file" onChange={(e) => setImagen(e.target.files[0])} />
                    {imagen && <p>Imagen seleccionada: {imagen.name}</p>}
                  </div>
                ) : (
                  <img src={item.urlImagen} alt="Imagen de publicidad" width="100" height="100" />
                )}
              </td>
              <td>
                {editarPublicidad && editarPublicidad.idpublicidad === item.idpublicidad ? (
                  <input type="text" value={editarPublicidad.urlPagina} onChange={(e) => setEditarPublicidad({ ...editarPublicidad, urlPagina: e.target.value })} />
                ) : (
                  item.urlPagina
                )}
              </td>
              <td>
                {editarPublicidad && editarPublicidad.idpublicidad === item.idpublicidad ? (
                  <input type="text" value={editarPublicidad.titulo} onChange={(e) => setEditarPublicidad({ ...editarPublicidad, titulo: e.target.value })} />
                ) : (
                  item.titulo
                )}
              </td>
              <td>
                {editarPublicidad && editarPublicidad.idpublicidad === item.idpublicidad ? (
                  <div>
                    <button className="btn-guardar-publicidad" onClick={() => handleGuardar(editarPublicidad)}>Guardar</button>
                    <button className="btn-cancelar-publicidad" onClick={handleCancelar}>Cancelar</button>
                  </div>
                ) : (
                  <div>
                    <button className="btn-editar-publicidad" onClick={() => handleEditar(item)}>Editar</button>
                    <button className="btn-borrar-publicidad" onClick={() => handleBorrar(item)}>Borrar</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManejoPublicidad;
