
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import HeaderPrime from './components/HeaderPrime';
import Footer from './components/Footer';
//import 'bootstrap/dist/js/bootstrap.bundle.min.js';
const root = createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
   <HeaderPrime/>
    <App />
    <Footer/>
  </BrowserRouter>
);