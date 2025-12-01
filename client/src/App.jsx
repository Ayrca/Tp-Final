
/*//import logo from './logo.svg';
//import React from 'react';
import './App.css';
import {Route, Routes} from 'react-router-dom';
import Buscador from './components/Buscador';
import Oficios from './components/Oficios';
import Carrusel from './components/Carrusel';
import CarruselOficios from './components/CarruselOficios';
import ListaProfesional from './components/ListaProfesional';
import Home from './components/Home';
import PreRegistro from './components/PreRegistro';
import Registro from './components/Registro';
import PerfilComercial from './components/PerfilComercial';
import PerfilUsuario from './components/PerfUsuario';
import PerfilAdmin from './components/PerfilAdmin';
import RecuperoPassword from './components/RecuperoPassword';
import ResetPassword from './components/ResetPassword';


function App() {
  return (
    <Routes>
      <Route path="/" element={
        <div className="App">

      <main className="indexmain">
            <div className="hero-section">
      <div className="hero-text">
        <h1>El Oficio para vos</h1>
        <p>La aplicación que te permitirá encontrar los mejores profesionales de manera fácil y rápida.</p>
      </div>
      <div className="hero-search">
        <Buscador />
      </div>
    </div>

        <section className="carousel-section">
          <Carrusel />
        </section>

        <section className="categories-section">
          <h2>Categorías relevantes</h2>
          <CarruselOficios />
        </section>
      </main>

        </div>
      } />
       <Route path="/oficios/:id" element={<ListaProfesional />} />
      <Route path="/oficios" element={<Oficios />} />
      <Route path="/profesional/:id" element={<ListaProfesional />} />
      <Route path="/" element={<Home />} />
      <Route path="/pre-registro" element={<PreRegistro />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="usuario/perfil" element={<PerfilUsuario />} />
      <Route path="/profesional/perfil/:id" element={<PerfilComercial />} />
      <Route path="/admin/perfil" component={PerfilAdmin} />
      <Route path="/RecuperoPassword" element={<RecuperoPassword />} />
       <Route path="/reset-password/:token" component={ResetPassword} />
    
    </Routes>


  );
}
export default App;
*/



import './App.css';
import {Route, Routes} from 'react-router-dom';
import Buscador from './components/Buscador';
import Oficios from './components/Oficios';
import Carrusel from './components/Carrusel';
import CarruselOficios from './components/CarruselOficios';
import ListaProfesional from './components/ListaProfesional';
import Home from './components/Home';
import PreRegistro from './components/PreRegistro';
import Registro from './components/Registro';
import PerfilComercial from './components/PerfilComercial';
import PerfilUsuario from './components/PerfUsuario';
import PerfilAdmin from './components/PerfilAdmin';
import RecuperoPassword from './components/RecuperoPassword';
import ResetPassword from './components/ResetPassword';

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <div className="App">
          <main className="indexmain">
            <div className="hero-section">
              <div className="hero-text">
                <h1>El Oficio para vos</h1>
                <p>La aplicación que te permitirá encontrar los mejores profesionales de manera fácil y rápida.</p>
              </div>
              <div className="hero-search">
                <Buscador />
              </div>
            </div>
            <section className="carousel-section">
              <Carrusel />
            </section>
            <section className="categories-section">
              <h2>Categorías relevantes</h2>
              <CarruselOficios />
            </section>
          </main>
        </div>
      } />
      <Route path="/oficios/:id" element={<ListaProfesional />} />
      <Route path="/oficios" element={<Oficios />} />
      <Route path="/profesional/:id" element={<ListaProfesional />} />
      <Route path="/home" element={<Home />} />
      <Route path="/pre-registro" element={<PreRegistro />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/usuario/perfil" element={<PerfilUsuario />} />
      <Route path="/profesional/perfil/:id" element={<PerfilComercial />} />
      <Route path="/admin/perfil" element={<PerfilAdmin />} />
      <Route path="/recuperoPassword" element={<RecuperoPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;
