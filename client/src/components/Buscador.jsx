import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './estilos/Buscador.css';
import { Link, useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Buscador = () => {
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const contenedorRef = useRef(null);

  const normalizar = (texto) =>
    texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
        setResultados([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = async (e) => {
    const valor = e.target.value;
    setTextoBusqueda(valor);
    setError(null);

    if (valor.length > 0) {
      try {
        const response = await axios.get(
          `${BASE_URL}/oficios?nombre_like=${valor}`
        );

        if (Array.isArray(response.data)) {
          const textoNormalizado = normalizar(valor);
          const resultadosFiltrados = response.data.filter((resultado) =>
            normalizar(resultado.nombre).includes(textoNormalizado)
          );
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
      if (resultados[0].idOficios) navigate(`/oficios/${resultados[0].idOficios}`);
      else setError('No se pudo determinar el ID del oficio');
    }
    if (e.key === 'Escape') setResultados([]);
  };

  const handleResultadoClick = (idOficios) => {
    if (idOficios) navigate(`/oficios/${idOficios}`);
    else setError('No se pudo determinar el ID del oficio');
  };

  return (
    <div className="buscador-container" ref={contenedorRef}>
      <div className="buscador-container1">
        <input
          type="text"
          value={textoBusqueda}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Buscar..."
        />

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