// Función para redirigir a otras páginas
function redirectTo(page) {
  window.location.href = page;
}

// Función para cerrar sesión
function toggleSession() {
  localStorage.removeItem('token'); // Elimina el token del almacenamiento
  window.location.href = 'login.html'; // Redirige al login después de cerrar sesión
}