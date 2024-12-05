    // Función para manejar el cierre de sesión
    function toggleSession() {
        localStorage.removeItem('token'); // Elimina el token del almacenamiento
        window.location.href = 'login.html'; // Redirige al login después de cerrar sesión
      }
  
      // Eventos de los botones
      document.getElementById("btnInicio").addEventListener("click", () => {
        window.location.href = "index.html";
      });
  
      document.getElementById("btnExplorar").addEventListener("click", () => {
        window.location.href = "explorar.html";
      });
  
      document.getElementById("btnComunidad").addEventListener("click", () => {
        window.location.href = "comunidad.html";
      });
  
      document.getElementById("btnPerfil").addEventListener("click", () => {
        window.location.href = "perfil.html";
      });