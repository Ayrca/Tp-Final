document.addEventListener("DOMContentLoaded", () => {
  const botones = document.querySelectorAll(".btn-opcion");

  botones.forEach(boton => {
    boton.addEventListener("click", () => {
      const tipo = boton.getAttribute("data-tipo");
      localStorage.setItem("tipoUsuario", tipo);
      window.location.href = "registro.html";
    });
  });
});