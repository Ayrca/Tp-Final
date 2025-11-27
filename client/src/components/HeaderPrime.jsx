
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

const HeaderPrime = () => {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
 const handleRegistro = () => {
    setShowModal(false);
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
   const response = await axios.post('http://localhost:3000/auth/login', {                                  
      email,
      password,
    });
    const token = response.data.access_token;
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    const userType = decoded.tipo;
    setIsLoggedIn(true);
    setShowModal(false);
    Swal.fire({
      title: 'Éxito',
      text: 'Has iniciado sesión correctamente',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    }).then(() => {
      if (userType === 'usuario') {
        navigate('/usuario/perfil');
      } else if (userType === 'profesional') {
        navigate('/profesional/perfil');
      }
    });
  } catch (error) {
      if (error.response && error.response.status === 401) {
        if (error.response.data.message === 'Usuario no encontrado') {
          Swal.fire({
            title: 'Error',
            text: 'El usuario no existe',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        } else if (error.response.data.message === 'Contraseña incorrecta') {
          Swal.fire({
            title: 'Error',
            text: 'La contraseña es incorrecta',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Usuario o contraseña incorrectos',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      } else {
        console.error(error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

const [showPassword, setShowPassword] = useState(false);

const handleTogglePassword = () => {
  setShowPassword(!showPassword);
};

  return (
    <header>
      <nav className="navbar navbar-expand-md navbar-light bg-light border-bottom mb-4">
        <div className="container">
   
<Link className="navbar-brand" to="/">
            <img src="../assets/images/logo-afip.jpg" alt="Logo" width="150" height="150" className="me-2"/>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarContenido">
            <ul className="navbar-nav ms-auto mb-3 mb-md-0">
              <li className="nav-item me-md-2 mb-2 mb-md-0">
                <Link className="btn btn-outline-secondary w-100" to="/">Inicio</Link>
              </li>
              <li className="nav-item me-md-2 mb-2 mb-md-0">
                <Link className="btn btn-outline-secondary w-100" to="/oficios">Oficios</Link>
              </li>
            </ul>

          <div className="d-flex flex-column flex-md-row gap-2 ms-md-3">
            {isLoggedIn ? (
              <div className="dropdown">
                <button className="btn btn-dark dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                  Mi cuenta
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li><Link className="dropdown-item" to="/usuario/perfil">Perfil</Link></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Cerrar sesión</button></li>
                </ul>
              </div>
            ) : (
              <button type="button" className="btn btn-dark" onClick={handleShowModal}>Iniciar Sesión</button>
            )}
          </div>
        </div>
    </div>

      </nav>

     {showModal && (
        <div id="exampleModal" className="modal fade show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">Iniciar Sesión</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Cerrar"></button>
              </div>
              <div className="modal-body">
                <form id="modalLoginForm" className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
                  <h1 className="h3 mb-3 fw-normal text-center">Iniciar sesión</h1>
                  <div className="form-floating">
                    <input type="email" className="form-control" id="modalEmail" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label htmlFor="modalEmail">Correo Electrónico</label>
                  </div>

<div className="form-floating position-relative">
  <input type={showPassword ? 'text' : 'password'} className="form-control" id="modalPassword" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
  <label htmlFor="modalPassword">Contraseña</label>
  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} id="togglePassword" onClick={handleTogglePassword}></i>
</div>


                  <div className="form-check text-start my-3">
                    <input className="form-check-input" type="checkbox" value="remember-me" id="checkDefault" />
                    <label className="form-check-label" htmlFor="checkDefault">Recordarme</label>
                  </div>
                  <div>
                    <button type="button" className="btn btn-link" data-bs-toggle="modal" data-bs-target="">Recuperar Contraseña</button>
                  </div>
                  <div>
                    <a href="/pre-registro">
                      <button id="btnRegistrar" type="button" className="btn btn-dark w-100 w-md-auto" onClick={handleRegistro}> Registrarse </button>
                    </a>
                  </div>
                  <button className="btn btn-primary w-100 py-2" type="submit">Ingresar</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderPrime;