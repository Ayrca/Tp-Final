import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import "./estilos/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-left">
          <span>© 2025 El oficio para vos. Todos los derechos reservados.</span>
        </div>

        <div className="footer-right">
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="footer-icon"
          >
            <FaInstagram />
          </a>

          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="footer-icon"
          >
            <FaFacebookF />
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;