import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './estilos/listaOficios.css';

const BASE_URL = "https://tp-final-production.up.railway.app";

function Oficios() {
  const [oficios, setOficios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${BASE_URL}/oficios`)
      .then(response => {
        const datosOrdenados = response.data.sort((a, b) =>
          (a.nombre || a.titulo).localeCompare(b.nombre || b.titulo)
        );
        setOficios(datosOrdenados);
      })
      .catch(error => console.error('Error al cargar datos:', error));
  }, []);

  const handleClick = (id, nombre) => {
    localStorage.setItem('categoriaId', id);
    localStorage.setItem('categoria', nombre);
    navigate(`/profesional/${id}`);
  };

  // Normalizar texto para búsqueda flexible
  const normalizar = (texto) =>
    texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")  // quitar acentos
      .toLowerCase();

  // Filtrado por búsqueda ignorando acentos y mayúsculas
  const oficiosFiltrados = oficios.filter(oficio =>
    normalizar(oficio.nombre || oficio.titulo)
      .includes(normalizar(busqueda))
  );

  return (
    <div className="listaOficios">
      <h1>Todos los oficios</h1>

      <input
        type="text"
        placeholder="Buscar oficio..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="buscadorOficios"
      />

      <ul>
        {oficiosFiltrados.length > 0 ? (
          oficiosFiltrados.map((oficio, index) => (
            <li key={index}>
              <button onClick={() => handleClick(oficio.idOficios, oficio.nombre || oficio.titulo)}>
                <h3>{oficio.nombre || oficio.titulo}</h3>
              </button>
            </li>
          ))
        ) : (
          <p>No hay oficios disponibles</p>
        )}
      </ul>
    </div>
  );
}

export default Oficios;