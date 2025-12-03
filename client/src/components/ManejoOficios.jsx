
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './estilos/ManejoOficios.css';
import Swal from 'sweetalert2';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const ManejoOficios = () => {
  const [oficios, setOficios] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nombre, setNombre] = useState('');
  const [imagen, setImagen] = useState(null);
  const [editarOficio, setEditarOficio] = useState(null);

  useEffect(() => {
      axios.get(`${BASE_URL}/oficios`)
      .then((response) => {
        setOficios(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSubmit = (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('nombre', nombre);
  formData.append('imagen', imagen);

  if (editarOficio) {
      axios.put(`${BASE_URL}/oficios/${editarOficio.idOficios}`, formData)
      .then((response) => {
        const nuevosOficios = oficios.map((oficio) => {
          if (oficio.idOficios === editarOficio.idOficios) {
            return response.data;
          }
          return oficio;
        });
        setOficios(nuevosOficios);
        setEditarOficio(null);
        setNombre('');
        setImagen(null);
        setMostrarFormulario(false);
        Swal.fire(
          'Guardado!',
          'El oficio ha sido guardado',
          'success'
        );
      })
      .catch((error) => {
        console.error(error);
        Swal.fire(
          'Error!',
          'No se pudo guardar el oficio',
          'error'
        );
      });
  } else {
      axios.post(`${BASE_URL}/oficios`, formData)
      .then((response) => {
        setOficios([...oficios, response.data]);
        setNombre('');
        setImagen(null);
        setMostrarFormulario(false);
        Swal.fire(
          'Agregado!',
          'El oficio ha sido agregado',
          'success'
        );
      })
      .catch((error) => {
        console.error(error);
        Swal.fire(
          'Error!',
          'No se pudo agregar el oficio',
          'error'
        );
      });
  }
};

const handleEditar = (oficio) => {
    setEditarOficio(oficio);
  };

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
        axios.delete(`${BASE_URL}/oficios/${oficio.idOficios}`)
        .then(() => {
          const nuevosOficios = oficios.filter((o) => o.idOficios !== oficio.idOficios);
          setOficios(nuevosOficios);
          Swal.fire(
            'Borrado!',
            'El oficio ha sido borrado',
            'success'
          );
        })
        .catch((error) => {
          console.error(error);
          Swal.fire(
            'Error!',
            'No se pudo borrar el oficio',
            'error'
          );
        });
    }
  });
};

const handleGuardar = (oficio) => {
  const updatedOficio = {
    nombre: oficio.nombre,
    urlImagen: imagen ? `/assets/images/oficios/${imagen.name}`  : oficio.urlImagen,
  };

    axios.put(`${BASE_URL}/oficios/${oficio.idOficios}`, updatedOficio)
    .then((response) => {
      const nuevosOficios = oficios.map((o) => {
        if (o.idOficios === oficio.idOficios) {
          return response.data;
        }
        return o;
      });
      setOficios(nuevosOficios);
      setEditarOficio(null);
      setImagen(null);
      Swal.fire(
        'Guardado!',
        'El oficio ha sido guardado',
        'success'
      );
    })
    .catch((error) => {
      console.error(error);
      Swal.fire(
        'Error!',
        'No se pudo guardar el oficio',
        'error'
      );
    });
};

  return (
    <div className="manejo-oficios">
      <button onClick={() => setMostrarFormulario(!mostrarFormulario)}>Agregar Oficio</button>
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
                  <input type="text" value={oficio.nombre} onChange={(e) => setOficios(oficios.map((o) => o.idOficios === oficio.idOficios ? { ...o, nombre: e.target.value } : o))} />
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
                  <img src={`${oficio.urlImagen}`} alt="Imagen de oficio" width="100" height="100" />
                )}
              </td>
              <td>
                {editarOficio && editarOficio.idOficios === oficio.idOficios ? (
                  <div>
                    <button className="btn-guardar" onClick={() => handleGuardar(oficio)}>Guardar</button>
                    <button className="btn-cancelar" onClick={() => setEditarOficio(null)}>Cancelar</button>
                  </div>
                ) : (
                  <div>
                    <button className="btn-editar" onClick={() => handleEditar(oficio)}>Editar</button>
                    <button className="btn-borrar" onClick={() => handleBorrar(oficio)}>Borrar</button>
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