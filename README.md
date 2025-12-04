# 🏗️ AFIP – Plataforma de Búsqueda y Gestión de Profesionales

AFIP es una plataforma web que permite a usuarios encontrar, contactar y contratar profesionales de diversos oficios, mientras que los profesionales pueden gestionar sus trabajos, su perfil y su disponibilidad.  
El sistema incluye también un panel administrativo completo para la gestión de usuarios, oficios y publicidades.

Desarrollado por **Francisco Arcidiacono**, **Paula Fernández** e **Ignacio Amaya**.

---

## 🚀 Tecnologías utilizadas

### Frontend
- React.js  
- Axios  
- SweetAlert2  
- CSS  
- Deploy: **Vercel**

### Backend
- NestJS  
- JWT Authentication  
- Bcrypt  
- TypeORM  
- Deploy: **Railway**

### Base de Datos
- MySQL (Railway)

---

## 🔧 Arquitectura
El sistema está dividido en tres capas:

1. **Frontend (React)**:  
   Interfaz para clientes, profesionales y administradores.

2. **Backend (NestJS)**:  
   API REST responsable de autenticación, lógica de negocio, validación, contratación, valoraciones y módulo de administración.

3. **Base de datos (MySQL)**:  
   Persistencia de usuarios, oficios, trabajos, valoraciones, fotos y publicidad.

---

# 👥 Roles del sistema

## 🧑‍💼 Usuario Cliente
- Buscar oficios o profesionales.
- Contratar y contactar profesionales.
- Ver fichas técnicas, valoraciones y trabajos realizados.
- Finalizar trabajo dejando valoración y comentario.
- Cancelar trabajo dejando comentario (sin afectar promedio).
- Editar foto y datos personales.
- Ver todos sus trabajos en una sección dedicada.

---

## 🧑‍🔧 Usuario Profesional
- Crear y editar perfil profesional.
- Subir fotos de trabajos anteriores.
- Agregar descripción de su servicio.
- Ver trabajos pendientes, finalizados y cancelados.
- Finalizar o cancelar trabajos (sin dejar valoración).
- Cambiar su estado a **Disponible** o **No Disponible**  
  (si está No Disponible no puede ser contratado).

---

## 🛠️ Administrador
- Gestionar oficios.
- Gestionar usuarios y profesionales.
- Gestionar publicidades (carrusel principal).
- Activar / desactivar usuarios o profesionales.

---

## 🎡 Funcionalidades destacadas
- Buscador completo de oficios y profesionales.
- Carrusel de publicidad para profesionales destacados.
- Carrusel fijo con todos los oficios disponibles.
- Gestión de valoraciones con cálculo automático de promedio.
- Control de disponibilidad del profesional.
- Sistema de contratación entre cliente y profesional.
- Subida de imágenes de trabajos con múltiples fotos.
- Dashboard completo para cada tipo de usuario.
