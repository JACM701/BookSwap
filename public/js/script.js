// Llamar a las funciones del archivo libros.js
import { getBooks, editBook, deleteBook, closeModal } from './libros.js';

// Función para redirigir a la página correspondiente
function redirectTo(page) {
  window.location.href = page;
}

// --- FUNCIONES DE NAVEGACIÓN ---
document.getElementById('btnInicio').addEventListener('click', function() {
  redirectTo('index.html');
});

document.getElementById('btnExplorar').addEventListener('click', function() {
  redirectTo('explorar.html');
});

document.getElementById('btnComunidad').addEventListener('click', function() {
  redirectTo('comunidad.html');
});

document.getElementById('btnBlog').addEventListener('click', function() {
  redirectTo('blog.html');
});

document.getElementById('btnVolver').addEventListener('click', function() {
  redirectTo('index.html');
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
