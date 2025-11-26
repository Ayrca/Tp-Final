import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './estilos/Buscador.css'; 
import { Link, useNavigate } from 'react-router-dom';
const Buscador = () => {
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleInputChange = async (e) => {
    setTextoBusqueda(e.target.value);
    setError(null);
    if (e.target.value.length > 0) {
      try {
            const response = await axios.get(`http://localhost:3000/oficios?nombre_like=${e.target.value}`);                                                        
        if (Array.isArray(response.data)) {
          const resultadosFiltrados = response.data.filter(resultado => resultado.nombre.toLowerCase().startsWith(e.target.value.toLowerCase()));
          setResultados(resultadosFiltrados);
        } else {
          setError('La respuesta del servidor no es válida');
        }
      } catch (error) {
        setError('Error al realizar la búsqueda');
        console.error(error);
      }
    } else {
      setResultados([]);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && resultados.length > 0) {
      if (resultados[0].idOficios) {
        navigate(`/oficios/${resultados[0].idOficios}`);
      } else {
        setError('No se pudo determinar el ID del oficio');
      }
    }
  };
  const handleResultadoClick = (idOficios) => {
    if (idOficios) {
      navigate(`/oficios/${idOficios}`);
    } else {
      setError('No se pudo determinar el ID del oficio');
    }
  };
  return (
    <div className="buscador-container">
      <div className="buscador-container1">
        <input type="text" value={textoBusqueda} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="Buscar..." />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {resultados.length > 0 && (
        <ul className="resultados" style={{ zIndex: 1 }}>
  {resultados.map((resultado, index) => (
    <li key={index} onClick={() => handleResultadoClick(resultado.idOficios)}>
      <Link to={`/oficios/${resultado.idOficios}`} onClick={(e) => e.preventDefault()}>
        {resultado.nombre}
      </Link>
    </li>
  ))}
</ul>
        )}
      </div>
      <div>
        <Link to="/oficios">
          <button>Todos los Oficios</button>
        </Link>
      </div>
    </div>
  );
};
export default Buscador;