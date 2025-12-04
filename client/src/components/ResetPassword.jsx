import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import "./estilos/RecuperoPassword.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const { token } = useParams();
  
  useEffect(() => {
    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      const tipo = decodedToken.tipo;

      const obtenerDatosPerfil = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/auth/usuario/${userId}/${tipo}`);
          const datosPerfil = response.data;
          setEmail(datosPerfil.email);
          setNombre(datosPerfil.nombre);
          setApellido(datosPerfil.apellido);
        } catch (error) {
          console.error(error);
        }
      };

      obtenerDatosPerfil();
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      Swal.fire({
        title: 'Error',
        text: 'Las contraseñas no coinciden',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
      return;
    }
    try {
      const response = await axios.post(`${BASE_URL}/auth/reset-password/${token}`, {
        password,
      });
      Swal.fire({
        title: 'Éxito',
        text: 'La contraseña se ha restablecido correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      }).then(() => {
        window.location.href = '/';
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Error al restablecer la contraseña',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Restablecer Contraseña</h2>
      <p>Email: {email}</p>
      <p>Nombre y Apellido: {nombre} {apellido}</p>
      <form onSubmit={handleSubmit}>
        <div className="password-field">
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Nueva Contraseña" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button 
            type="button" 
            className="toggle-password" 
            onClick={() => setShowPassword(!showPassword)}
          >
            <img
              src={showPassword ? "../assets/images/eye-open.png" : "../assets/images/eye-closed.png"}
              alt="Toggle password"
              style={{ width: '20px', height: '20px' }}
            />
          </button>
        </div>

        <div className="password-field">
          <input 
            type={showConfirmPassword ? "text" : "password"} 
            placeholder="Confirmar Contraseña" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
          <button 
            type="button" 
            className="toggle-password" 
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <img
              src={showConfirmPassword ? "../assets/images/eye-open.png" : "../assets/images/eye-closed.png"}
              alt="Toggle confirm password"
              style={{ width: '20px', height: '20px' }}
            />
          </button>
        </div>

        <button type="submit">Restablecer Contraseña</button>
      </form>
    </div>
  );
};

export default ResetPassword;
