//import logo from './logo.svg';
import './App.css';
//import React from 'react';
import { Route, Routes} from 'react-router-dom';
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

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <div className="App">
          <main className="indexmain">
            <div className="texto1">
              <h2>El Oficio para vos</h2>
              <p> La aplicación que te permitirá encontrar los mejores profesionales de manera fácil y rápida. </p>
            </div>
            <div>
              <Buscador/>
            </div>
            <section>
              <Carrusel/>
            </section>
            <section >
              <h3>Categorías relevantes</h3>
              <CarruselOficios/>
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
    </Routes>

  );
}
export default App;

