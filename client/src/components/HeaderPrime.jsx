import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './estilos/HeaderPrime.css';

const HeaderPrime = () => {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!showModal) return;
    const handleKeyDown = (e) => e.key === "Escape" && setShowModal(false);
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowModal(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { email, password });
      const token = response.data.access_token;
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      setShowModal(false);
      setDropdownOpen(false);
      Swal.fire('Éxito', 'Has iniciado sesión correctamente', 'success').then(() => navigate('/'));
    } catch (error) {
      if (error.response?.data?.message) {
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
          <Link to="/"><img src="../assets/images/logo-afip.jpg" alt="Logo" className="logo" /></Link>
        </div>

        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className="header-link-btn">Inicio</Link>
          <Link to="/oficios" className="header-link-btn">Oficios</Link>

          {isLoggedIn ? (
            <div className="dropdown" ref={dropdownRef}>
              <button className="dropdown-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                Mi cuenta <span className={`arrow ${dropdownOpen ? "open" : ""}`}>▼</span>
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link className="dropdown-item" to="/usuario/perfil" onClick={() => setDropdownOpen(false)}>Perfil</Link>
                  <button className="dropdown-item" onClick={handleLogout}>Cerrar sesión</button>
                </div>
              )}
            </div>
          ) : (
            <button className="header-login-btn" onClick={() => setShowModal(true)}>Iniciar Sesión</button>
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
          <div className="modal-dialog" ref={modalRef}>
            <div className="modal-content">
              <div className="modal-header">
                <h5>Iniciar Sesión</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
              </div>

              <div className="modal-body">
                <form className="login-form" onSubmit={handleSubmit}>
                  <div className="form-floating">
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                    <label>Email</label>
                  </div>

                  <div className="form-floating password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Contraseña"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                    <label>Contraseña</label>
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