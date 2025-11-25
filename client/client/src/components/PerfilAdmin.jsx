
import React, { useState, useEffect } from 'react';
import './estilos/PerfilAdmin.css';
import axios from 'axios';
import Swal from 'sweetalert2';

  const PerfilAdmin = () => {
  const [admin, setAdmin] = useState({});
  const [publicidad, setPublicidad] = useState([]);
  const [mostrarPublicidad, setMostrarPublicidad] = useState(false);
  const [editarPublicidad, setEditarPublicidad] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get("http://localhost:3000/auth/perfil", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      .then((response) => {
        console.log('Datos del administrador:', response.data);
        setAdmin(response.data);
      })
      .catch((error) => {
        console.error('Error al cargar datos del administrador:', error);
      });
    } else {
      console.log('No hay token');
    }
  }, []);

   
const cargarPublicidad = () => {
  if (mostrarPublicidad) {
    setMostrarPublicidad(false);
  } else {
    axios.get("http://localhost:3000/publicidad")
      .then((response) => {
        console.log('Datos de la publicidad:', response.data);
        setPublicidad(response.data);
        setMostrarPublicidad(true);
      })
      .catch((error) => {
        console.error('Error al cargar datos de la publicidad:', error);
      });
  }
};

  const handleEditar = (item) => {
    setEditarPublicidad(item);
  };

  const handleCancelar = () => {
  setEditarPublicidad(null);
  setImagen(null);
  };

const [titulo, setTitulo] = useState('');
const [urlPagina, setUrlPagina] = useState('');
const [imagen, setImagen] = useState(null);


  const handleMostrarFormulario = () => {
    setMostrarFormulario(true);
  };



const handleSubmit = (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('imagen', imagen);

  axios.post('http://localhost:3000/imagenPropaganda', formData)
    .then((response) => {
      const urlImagen = `/assets/images/patro/${response.data}`;
      const nuevaPublicidad = {
        titulo,
        urlPagina,
        urlImagen,
      };

      axios.post('http://localhost:3000/publicidad', nuevaPublicidad)
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
      axios.delete(`http://localhost:3000/publicidad/${item.idpublicidad}`)
        .then(() => {
          axios.delete(`http://localhost:3000/imagenPropaganda/${nombreImagen}`)
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

axios.post(`http://localhost:3000/imagenPropaganda`, formData)
      .then((response) => {
        console.log('Imagen subida:', response.data);
        item.urlImagen = `/assets/images/patro/${response.data}`;
        axios.put(`http://localhost:3000/publicidad/${item.idpublicidad}`, item)
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
    axios.put(`http://localhost:3000/publicidad/${item.idpublicidad}`, item)
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditarPublicidad({ ...editarPublicidad, [name]: value });
  };

  const handleImagenChange = (e) => {
    setImagen(e.target.files[0]);
  };

return (
  <div className="perfil-admin-container">
    <div className='datosAdmin'>
      <h1>Perfil de Administrador</h1>
      <p>Nombre: {admin.nombre}</p>
      <p>Apellido: {admin.apellido}</p>
      <p>Email: {admin.email}</p>
    </div>
    <div className="botones-admin">
      <button className="boton-admin" onClick={cargarPublicidad}>
        Manejo de Publicidad
      </button>
      <button className="boton-admin" onClick={() => console.log('Manejo de Usuarios')}>
        Manejo de Usuarios
      </button>
      <button className="boton-admin" onClick={() => console.log('Manejo de Profesionales')}>
        Manejo de Profesionales
      </button>
    </div>
    {mostrarPublicidad && (
      <div>
        <button className="boton-admin" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
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
        <div className='tabla-container'>
          <table>
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
                        <input type="file" onChange={handleImagenChange} />
                        {imagen && <p>Imagen seleccionada: {imagen.name}</p>}
                      </div>
                    ) : (
                      <img src={item.urlImagen} alt="Imagen de publicidad" width="100" height="100" />
                    )}
                  </td>
                  <td>
                    {editarPublicidad && editarPublicidad.idpublicidad === item.idpublicidad ? (
                      <input type="text" name="urlPagina" value={editarPublicidad.urlPagina} onChange={handleChange} />
                    ) : (
                      item.urlPagina
                    )}
                  </td>
                  <td>
                    {editarPublicidad && editarPublicidad.idpublicidad === item.idpublicidad ? (
                      <input type="text" name="titulo" value={editarPublicidad.titulo} onChange={handleChange} />
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
      </div>
    )}
  </div>
);
};
export default PerfilAdmin;