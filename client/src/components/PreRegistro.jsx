import React from 'react';
import { useNavigate } from 'react-router-dom';
import './estilos/PreRegistro.css'; 
const PreRegistro = () => {
  const navigate = useNavigate();
  const handleTipoCuenta = (tipo) => {
    localStorage.setItem("tipoUsuario", tipo);
    navigate("/registro");
  };
  return (
    <div className="d-flex flex-column">
    
      <main className="centrado">
        <div className="pre-registro-container">
          <h2>¿Qué tipo de cuenta deseas crear?</h2>
          <div className="opciones">
            <button className="btn-opcion" onClick={() => handleTipoCuenta('Cliente')}>Usuario</button>
            <button className="btn-opcion" onClick={() => handleTipoCuenta('profesional')}>Profesional</button>
          </div>
        </div>
      </main>
    
    </div>
  );
};
export default PreRegistro;