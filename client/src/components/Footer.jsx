import React from 'react';
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
       <div className="container">
      <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
        <div className="col-md-4 d-flex align-items-center">
         

<a href="/" className="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1" aria-label="Bootstrap">

</a>

          <span className="mb-3 mb-md-0 text-body-secondary">© 2025 El oficio para vos. Todos los derechos reservados.</span>
        </div>

        <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
          <li className="ms-3">
            <a className="text-body-secondary" href="#" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
          </li>
          <li className="ms-3">
            <a className="text-body-secondary" href="#" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
          </li>
        </ul>
      </footer>
    </div>
  );
};
export default Footer;