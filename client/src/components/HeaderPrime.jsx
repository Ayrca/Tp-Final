import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import './estilos/HeaderPrime.css';

const HeaderPrime = () => {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsLoggedIn(true);
  }, []);

  // Cerrar dropdown al click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { email, password });
      const token = response.data.access_token;
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      setShowModal(false);
      setDropdownOpen(false);

      Swal.fire({
        title: 'Éxito',
        text: 'Has iniciado sesión correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      }).then(() => navigate('/')); // redirigir siempre al inicio
    } catch (error) {
      if (error.response && error.response.data?.message) {
        Swal.fire('Error', error.response.data.message, 'error');
      } else {
        console.error(error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setDropdownOpen(false);
    navigate('/');
  };

  const handleDropdownItemClick = (callback) => {
    callback();
    setDropdownOpen(false);
  };

  return (
    <header className="header-prime">
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/">
            <img src="../assets/images/logo-afip.jpg" alt="Logo" className="logo" />
          </Link>
        </div>

        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className="header-link-btn">Inicio</Link>
          <Link to="/oficios" className="header-link-btn">Oficios</Link>

          {isLoggedIn ? (
            <div className="dropdown" ref={dropdownRef}>
            <button
              className="dropdown-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Mi cuenta
              <span className={`arrow ${dropdownOpen ? "open" : ""}`}>▼</span>
            </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link
                    className="dropdown-item"
                    to="/usuario/perfil"
                    onClick={() => handleDropdownItemClick(() => navigate('/usuario/perfil'))}
                  >
                    Perfil
                  </Link>
                  <button
                    className="dropdown-item"
                    onClick={() => handleDropdownItemClick(handleLogout)}
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="header-login-btn" onClick={handleShowModal}>Iniciar Sesión</button>
          )}
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </nav>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Iniciar Sesión</h5>
                <button className="btn-close" onClick={handleCloseModal}>×</button>
              </div>
              <div className="modal-body">
                <form className="login-form" onSubmit={handleSubmit}>
                  <div className="form-floating">
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                    <label>Email</label>
                  </div>
                  <div className="form-floating">
                    <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
                    <label>Contraseña</label>
                  </div>
                  <div className="form-check">
                    <input type="checkbox" id="rememberMe" />
                    <label htmlFor="rememberMe">Recordarme</label>
                  </div>
                  <div className="forgot-password">
                    <button type="button">Recuperar contraseña</button>
                  </div>
                  <div className="login-actions">
                    <button type="submit" className="btn btn-primary">Ingresar</button>
                    <Link to="/pre-registro" className="btn btn-dark">Registrarse</Link>
                  </div>
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