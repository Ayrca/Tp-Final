import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './estilos/ManejoOficios.css';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const ManejoOficios = () => {
  const [oficios, setOficios] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nombre, setNombre] = useState('');
  const [imagen, setImagen] = useState(null);
  const [editarOficio, setEditarOficio] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/oficios`)
      .then((response) => setOficios(response.data))
      .catch((error) => console.error(error));
  }, []);

  // -----------------------
  // Agregar nuevo oficio
  // -----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre) {
      Swal.fire('Error!', 'Debes ingresar un nombre', 'error');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('nombre', nombre);
      if (imagen) formData.append('file', imagen); // archivo real

      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/oficios/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setOficios([...oficios, response.data]);
      setNombre('');
      setImagen(null);
      setMostrarFormulario(false);
      Swal.fire('Agregado!', 'El oficio ha sido agregado', 'success');
    } catch (error) {
      console.error(error);
      Swal.fire('Error!', 'No se pudo agregar el oficio', 'error');
    }
  };

  // -----------------------
  // Editar oficio
  // -----------------------
  const handleEditar = (oficio) => {
    setEditarOficio(oficio);
    setNombre(oficio.nombre);
  };

  const handleCancelar = () => {
    setEditarOficio(null);
    setImagen(null);
  };

  const handleGuardar = async (oficio) => {
    try {
      const formData = new FormData();
      formData.append('nombre', oficio.nombre);
      if (imagen) formData.append('file', imagen); // archivo real

      const token = localStorage.getItem('token');
      const response = await axios.put(`${BASE_URL}/oficios/upload/${oficio.idOficios}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setOficios(oficios.map((o) =>
        o.idOficios === oficio.idOficios ? response.data : o
      ));
      setEditarOficio(null);
      setImagen(null);
      Swal.fire('Guardado!', 'El oficio ha sido actualizado', 'success');
    } catch (error) {
      console.error(error);
      Swal.fire('Error!', 'No se pudo actualizar el oficio', 'error');
    }
  };

  // -----------------------
  // Borrar oficio
  // -----------------------
  const handleBorrar = (oficio) => {
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
        const token = localStorage.getItem('token');
        axios.delete(`${BASE_URL}/oficios/${oficio.idOficios}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(() => {
            setOficios(oficios.filter((o) => o.idOficios !== oficio.idOficios));
            Swal.fire('Borrado!', 'El oficio ha sido borrado', 'success');
          })
          .catch((error) => {
            console.error(error);
            Swal.fire('Error!', 'No se pudo borrar el oficio', 'error');
          });
      }
    });
  };

  return (
    <div className="manejo-oficios">
      <button className="btn-agregar-oficio" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
        Agregar Oficio
      </button>

      {mostrarFormulario && (
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <br />
          <label>Imagen:</label>
          <input type="file" onChange={(e) => setImagen(e.target.files[0])} />
          <br />
          <button type="submit">Agregar Oficio</button>
          <button type="button" onClick={() => setMostrarFormulario(false)}>Cancelar</button>
        </form>
      )}

      <table className="tabla-oficios">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {oficios.map((oficio) => (
            <tr key={oficio.idOficios}>
              <td>{oficio.idOficios}</td>
              <td>
                {editarOficio && editarOficio.idOficios === oficio.idOficios ? (
                  <input
                    type="text"
                    value={oficio.nombre}
                    onChange={(e) =>
                      setOficios(oficios.map((o) =>
                        o.idOficios === oficio.idOficios
                          ? { ...o, nombre: e.target.value }
                          : o
                      ))
                    }
                  />
                ) : (
                  oficio.nombre
                )}
              </td>
              <td>
                {editarOficio && editarOficio.idOficios === oficio.idOficios ? (
                  <div>
                    <input type="file" onChange={(e) => setImagen(e.target.files[0])} />
                    {imagen && <p>Imagen seleccionada: {imagen.name}</p>}
                  </div>
                ) : (
                  <img src={oficio.urlImagen} alt="Imagen de oficio" width="100" height="100" />
                )}
              </td>
              <td>
                {editarOficio && editarOficio.idOficios === oficio.idOficios ? (
                  <div>
                    <button className="btn-guardar-oficios" onClick={() => handleGuardar(oficio)}>Guardar</button>
                    <button className="btn-cancelar-oficios" onClick={handleCancelar}>Cancelar</button>
                  </div>
                ) : (
                  <div>
                    <button className="btn-editar-oficios" onClick={() => handleEditar(oficio)}>Editar</button>
                    <button className="btn-borrar-oficios" onClick={() => handleBorrar(oficio)}>Borrar</button>
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

export default ManejoOficios;