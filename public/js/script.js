// Llamar a las funciones del archivo libros.js
import { getBooks, editBook, deleteBook, closeModal } from './libros.js';

// Función para redirigir a la página correspondiente
function redirectTo(page) {
  window.location.href = page;
}

// --- FUNCIONES DE NAVEGACIÓN ---
document.querySelectorAll('.cta').forEach(function(button) {
  button.addEventListener('click', function(event) {
    const page = event.target.closest('button').querySelector('span').textContent;
    alert(`Estás navegando a la sección: ${page}`);
  });
});

document.querySelector('.login-btn')?.addEventListener('click', function() {
  redirectTo('login.html');
});

document.querySelector('.register-btn')?.addEventListener('click', function() {
  redirectTo('registro.html');
});

document.querySelector('.back-to-login')?.addEventListener('click', function() {
  redirectTo('login.html');
});

// Agregar event listeners a los enlaces del footer
document.querySelectorAll('footer a').forEach(function(link) {
  link.addEventListener('click', function(event) {
    event.preventDefault();
    const page = event.target.getAttribute('href');
    alert(`Estás navegando a la página: ${page}`);
    redirectTo(page);
  });
});

// Llamar a getBooks para cargar los libros al cargar la página
getBooks();
