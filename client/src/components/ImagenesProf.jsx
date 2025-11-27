
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './estilos/imagenesProf.css';
const ImagenesProf = ({ idProfesional }) => {
  const [imagenes, setImagenes] = useState([]);
  const [file, setFile] = useState(null);



  useEffect(() => {
    axios.get(`http://localhost:3000/imagen/${idProfesional}`)
      .then((response) => {
        setImagenes(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [idProfesional]);

  
  const handleSubmit = (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);


    axios.post(`http://localhost:3000/imagen/upload/${idProfesional}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      }
    })
    .then((response) => {
      setImagenes([...imagenes, response.data]);
    })
    .catch((error) => {
      console.error('Error al subir imagen:', error);
    });
  };


  const handleFileChange = (event) => {
  const file = event.target.files[0];
  console.log(file); // Agrega este console.log
  setFile(file);
};


  return (
    <div className='cajaImagenes'>
      <h3>Imagenes de Trabajos anteriores</h3>
      <div className="imagenes-container" id="imagenes-container">

<div>
      {imagenes.map((imagen, index) => (
        <img key={index} src={imagen.url} alt="Imagen" />
      ))}
    </div>

        
      </div>
      <form onSubmit={handleSubmit}>
        <input type="file" id="file-input" accept="image/*" onChange={handleFileChange} />
        <button type="submit" id="agregar-imagen"> Agregar imagen</button>
      </form>
    </div>
  );
};


export default ImagenesProf;



