
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './estilos/ManejoPublicidad.css';

const BASE_URL = "https://tp-final-production.up.railway.app";

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


const handleSubmit = (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('imagen', imagen);

  axios.post(`${BASE_URL}/imagenPropaganda`, formData)
    .then((response) => {
      const urlImagen = `/assets/images/patro/${response.data}`;
      const nuevaPublicidad = {
        titulo,
        urlPagina,
        urlImagen,
      };

      axios.post(`${BASE_URL}/publicidad`, nuevaPublicidad)
        .then((response) => {
          setPublicidad([...(publicidad || []), response.data]);
      
          console.log(response.data);
          // Agregar la publicidad a la lista de publicidad
          setPublicidad([...publicidad, response.data]);
          Swal.fire(
            'Agregado!',
            'La publicidad ha sido agregada',
            'success'
          );
          setTitulo('');
          setUrlPagina('');
          setImagen(null);
          setMostrarFormulario(false);
        })
        .catch((error) => {
          console.error(error);
          Swal.fire(
            'Error!',
            'No se pudo agregar la publicidad',
            'error'
          );
        });
    })
    .catch((error) => {
      console.error(error);
      Swal.fire(
        'Error!',
        'No se pudo subir la imagen',
        'error'
      );
    });
};

  const handleEditar = (item) => {
    setEditarPublicidad(item);
  };

  const handleCancelar = () => {
    setEditarPublicidad(null);
    setImagen(null);
  };

  const handleBorrar = (item) => {
  const nombreImagen = item.urlImagen.split('/').pop();

  Swal.fire({
    title: '¿Estás seguro?',
    text: 'No podrás revertir este cambio',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, borrar'
  }).then((result) => {
    if (result.isConfirmed) {
      axios.delete(`${BASE_URL}/publicidad/${item.idpublicidad}`)
        .then(() => {
          axios.delete(`${BASE_URL}/imagenPropaganda/${nombreImagen}`)
            .then(() => {
              const nuevaPublicidad = publicidad.filter((p) => p.idpublicidad !== item.idpublicidad);
              setPublicidad(nuevaPublicidad);
              Swal.fire(
                'Borrado!',
                'La publicidad ha sido borrada',
                'success'
              );
            })
            .catch((error) => {
              console.error('Error al borrar imagen:', error);
              Swal.fire(
                'Error!',
                'No se pudo borrar la imagen',
                'error'
              );
            });
        })
        .catch((error) => {
          console.error('Error al borrar publicidad:', error);
          Swal.fire(
            'Error!',
            'No se pudo borrar la publicidad',
            'error'
          );
        });
    }
  });
};

const handleGuardar = (item) => {
  if (imagen) {
    const formData = new FormData();
    formData.append('imagen', imagen);

axios.post(`${BASE_URL}/imagenPropaganda`, formData)
      .then((response) => {
        console.log('Imagen subida:', response.data);
        item.urlImagen = `/assets/images/patro/${response.data}`;
        axios.put(`${BASE_URL}/publicidad/${item.idpublicidad}`, item)
          .then((response) => {
            console.log('Publicidad actualizada:', response.data);
            const nuevaPublicidad = publicidad.map((p) => p.idpublicidad === item.idpublicidad ? item : p);
            setPublicidad(nuevaPublicidad);
            setEditarPublicidad(null);
            setImagen(null);
          })
          .catch((error) => {
            console.error('Error al actualizar publicidad:', error);
          });
      })
      .catch((error) => {
        console.error('Error al subir imagen:', error);
      });
  } else {
    axios.put(`${BASE_URL}/publicidad/${item.idpublicidad}`, item)
      .then((response) => {
        console.log('Publicidad actualizada:', response.data);
        const nuevaPublicidad = publicidad.map((p) => p.idpublicidad === item.idpublicidad ? item : p);
        setPublicidad(nuevaPublicidad);
        setEditarPublicidad(null);
      })
      .catch((error) => {
        console.error('Error al actualizar publicidad:', error);
      });
  }
};

  return (
    <div className="manejo-publicidad">
      <button onClick={() => setMostrarFormulario(!mostrarFormulario)}>Agregar Publicidad</button>
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
                  <input type="text" name="urlPagina" value={editarPublicidad.urlPagina} onChange={(e) => setEditarPublicidad({ ...editarPublicidad, urlPagina: e.target.value })} />
                ) : (
                  item.urlPagina
                )}
              </td>
              <td>
                {editarPublicidad && editarPublicidad.idpublicidad === item.idpublicidad ? (
                  <input type="text" name="titulo" value={editarPublicidad.titulo} onChange={(e) => setEditarPublicidad({ ...editarPublicidad, titulo: e.target.value })} />
                ) : (
                  item.titulo
                )}
              </td>
              <td>
                {editarPublicidad && editarPublicidad.idpublicidad === item.idpublicidad ? (
                  <div>
                    <button onClick={() => handleGuardar(editarPublicidad)}>Guardar</button>
                    <button onClick={handleCancelar}>Cancelar</button>
                  </div>
                ) : (
                  <div>
                    <button onClick={() => handleEditar(item)}>Editar</button>
                    <button onClick={() => handleBorrar(item)}>Borrar</button>
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
