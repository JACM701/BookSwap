//public/js/index.js

// Función para redirigir a otras páginas
function redirectTo(page) {
  window.location.href = page;
}

// Verificar si el usuario está autenticado al cargar la página
function checkAuthentication() {
  const token = localStorage.getItem('token'); // Suponiendo que guardas el token en localStorage
  const profileButton = document.querySelector('button.cta[onclick*="redirectTo(\'perfil.html\')"]');
  const loginButton = document.querySelector('.login-btn');

  if (token) {
    // Si el token existe, el usuario está autenticado
    profileButton.style.display = 'block';  // Mostrar botón de perfil
    loginButton.style.display = 'none'; // Ocultar botón de inicio de sesión
  } else {
    // Si no hay token, el usuario no está autenticado
    profileButton.style.display = 'none';  // Ocultar botón de perfil
    loginButton.style.display = 'block';  // Mostrar botón de inicio de sesión
  }
}

// Funcionamiento de buscar
document.getElementById("search-form").addEventListener("submit", async function (event) {
  event.preventDefault(); // Evitar recargar la página

  const query = document.getElementById("search-query").value.trim();
  if (!query) {
    alert("Por favor, ingresa un término de búsqueda.");
    return;
  }

  try {
    // Realiza la búsqueda en tu API
    const response = await fetch(`https://bookswap-w7ze.onrender.com/api/search?query=${query}`);
    const data = await response.json();

    if (data && data.books.length > 0) {
      // Lógica para mostrar resultados en la página actual
      mostrarResultados(data.books);
    } else {
      alert("No se encontraron resultados para tu búsqueda.");
    }
  } catch (error) {
    console.error("Error al realizar la búsqueda:", error);
    alert("Ocurrió un error al buscar libros. Por favor, intenta de nuevo.");
  }
});

// Función para mostrar resultados en la página
function mostrarResultados(books) {
  const resultadosContainer = document.getElementById("resultados-container");
  resultadosContainer.innerHTML = ""; // Limpiar resultados previos

  books.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.classList.add("book-item");
    bookElement.innerHTML = `
      <h3>${book.title}</h3>
      <p>${book.author}</p>
      <button onclick="verDetalleLibro('${book._id}')">Ver Detalle</button>
    `;
    resultadosContainer.appendChild(bookElement);
  });
}

// Función para ver detalle de un libro
function verDetalleLibro(bookId) {
  window.location.href = `detalle-libro.html?id=${bookId}`;
}

// Manejo de la redirección para los botones de navegación en el header
document.querySelectorAll('.cta').forEach(button => {
  button.addEventListener('click', function() {
    const buttonText = button.querySelector('span').textContent.trim().toLowerCase();
    
    // Redirige según el texto del botón
    switch (buttonText) {
      case 'explorar libros':
        redirectTo('explorar.html');
        break;
      case 'perfil':
        redirectTo('perfil.html');
        break;
      case 'comunidad':
        redirectTo('comunidad.html');
        break;
      case 'blog':
        redirectTo('blog.html');
        break;
      case 'iniciar sesión':
        redirectTo('login.html');
        break;
      case 'regístrate':
        redirectTo('registro.html');
        break;
      default:
        console.log("Botón no reconocido");
    }
  });
});

// Función para manejar el redireccionamiento de los botones de acción (cta) en la sección "Únete a nuestra comunidad"
document.querySelector('.cta.button-primary').addEventListener('click', function() {
  redirectTo('registro.html');
});

// Función para manejar la redirección de los enlaces en el footer
document.querySelectorAll('.footer-links a').forEach(link => {
  link.addEventListener('click', function(event) {
    event.preventDefault();  // Evitar que el enlace se abra de forma predeterminada
    const href = link.getAttribute('href');
    
    // Redirigir según el href del enlace
    switch (href) {
      case 'contacto.html':
        redirectTo('contacto.html');
        break;
      case 'terminos.html':
        redirectTo('terminos.html');
        break;
      case 'privacidad.html':
        redirectTo('privacidad.html');
        break;
      default:
        console.log("Enlace no reconocido");
    }
  });
});

// Ejecutar la verificación de autenticación cuando se cargue la página
document.addEventListener("DOMContentLoaded", checkAuthentication);
