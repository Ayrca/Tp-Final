import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './estilos/ManejoPublicidad.css';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const ManejoPublicidad = () => {
  const [publicidad, setPublicidad] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [urlPagina, setUrlPagina] = useState('');
  const [file, setFile] = useState(null); // ⚡ Archivo real
  const [editarPublicidad, setEditarPublicidad] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/publicidad`)
      .then((response) => setPublicidad(response.data))
      .catch((error) => console.error(error));
  }, []);

  // Subir imagen al backend (igual que avatar o ImagenesProf)
  const subirImagenBackend = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    if (!token) throw new Error('No estás logueado');

    const response = await axios.post(
      `${BASE_URL}/publicidad/upload`, // ⚡ endpoint backend para subir imágenes
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.url; // backend devuelve { url: 'https://...' }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      Swal.fire('Error!', 'Debes seleccionar una imagen', 'error');
      return;
    }

    try {
      const urlImagen = await subirImagenBackend(file);

      const nuevaPublicidad = { titulo, urlPagina, urlImagen };

      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/publicidad`, nuevaPublicidad, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPublicidad([...publicidad, response.data]);
      Swal.fire('Agregado!', 'La publicidad ha sido agregada', 'success');

      setTitulo('');
      setUrlPagina('');
      setFile(null);
      setMostrarFormulario(false);
    } catch (error) {
      console.error(error);
      Swal.fire('Error!', 'No se pudo agregar la publicidad', 'error');
    }
  };

  const handleEditar = (item) => setEditarPublicidad(item);
  const handleCancelar = () => { setEditarPublicidad(null); setFile(null); };

  const handleBorrar = async (item) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir este cambio',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${BASE_URL}/publicidad/${item.idpublicidad}`);
        setPublicidad(publicidad.filter(p => p.idpublicidad !== item.idpublicidad));
        Swal.fire('Borrado!', 'La publicidad ha sido borrada', 'success');
      } catch (error) {
        console.error(error);
        Swal.fire('Error!', 'No se pudo borrar la publicidad', 'error');
      }
    }
  };

  const handleGuardar = async (item) => {
    try {
      let urlImagen = item.urlImagen;
      if (file) urlImagen = await subirImagenBackend(file);

      const dataActualizada = { ...item, urlImagen };
      const response = await axios.put(`${BASE_URL}/publicidad/${item.idpublicidad}`, dataActualizada);
      setPublicidad(publicidad.map(p => p.idpublicidad === item.idpublicidad ? response.data : p));

      setEditarPublicidad(null);
      setFile(null);
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
          <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} />
          <br />
          <label>URL de la Página:</label>
          <input type="text" value={urlPagina} onChange={e => setUrlPagina(e.target.value)} />
          <br />
          <label>Imagen:</label>
          <input type="file" onChange={e => setFile(e.target.files[0])} />
          <br />
          <button type="submit">Agregar Publicidad</button>
          <button type="button" onClick={() => setMostrarFormulario(false)}>Cancelar</button>
        </form>
      )}

      <table className="tabla-publicidad">
        <thead>
          <tr>
            <th>ID</th>
            <th>Imagen</th>
            <th>URL Pagina</th>
            <th>Titulo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {publicidad.map(item => (
            <tr key={item.idpublicidad}>
              <td>{item.idpublicidad}</td>
              <td>
                {editarPublicidad && editarPublicidad.idpublicidad === item.idpublicidad ? (
                  <div>
                    <input type="file" onChange={e => setFile(e.target.files[0])} />
                    {file && <p>Imagen seleccionada: {file.name}</p>}
                  </div>
                ) : (
                  <img src={item.urlImagen} alt="Publicidad" width="100" height="100" />
                )}
              </td>
              <td>
                {editarPublicidad && editarPublicidad.idpublicidad === item.idpublicidad ? (
                  <input type="text" value={editarPublicidad.urlPagina} onChange={e => setEditarPublicidad({ ...editarPublicidad, urlPagina: e.target.value })} />
                ) : item.urlPagina}
              </td>
              <td>
                {editarPublicidad && editarPublicidad.idpublicidad === item.idpublicidad ? (
                  <input type="text" value={editarPublicidad.titulo} onChange={e => setEditarPublicidad({ ...editarPublicidad, titulo: e.target.value })} />
                ) : item.titulo}
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
