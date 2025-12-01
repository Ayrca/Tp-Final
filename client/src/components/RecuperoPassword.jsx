

import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import "./estilos/RecuperoPassword.css";
const RecuperoPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/forgot-password', { email });
      setMessage('Se ha enviado un enlace de recuperación de contraseña a tu correo electrónico');
      Swal.fire({
        title: 'Éxito',
        text: 'Se ha enviado un enlace de recuperación de contraseña a tu correo electrónico',
        icon: 'success',
        confirmButtonText: 'Aceptar',
          }).then(() => {
      window.location.href = '/'; // Redirige al usuario a la página principal
      });
    } catch (error) {
      setMessage('Error al enviar el enlace de recuperación de contraseña');
      Swal.fire({
        title: 'Error',
        text: 'Error al enviar el enlace de recuperación de contraseña',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  };


 
  return (
     <div className="forgot-password-container">
      <h2>Recuperar Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit">Enviar Enlace de Recuperación</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default RecuperoPassword;