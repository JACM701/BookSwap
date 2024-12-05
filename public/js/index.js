// Función para redirigir a otras páginas
function redirectTo(page) {
  window.location.href = page;
}

// Verificar si el usuario está autenticado al cargar la página
function checkAuthentication() {
  const token = localStorage.getItem('token');
  const profileButton = document.querySelector('button.cta[onclick*="redirectTo(\'perfil.html\')"]');
  const loginButton = document.querySelector('.login-btn');
  const ctaSection = document.getElementById('cta-section');

  if (token) {
    profileButton.style.display = 'block';
    loginButton.style.display = 'none';
    ctaSection.style.display = 'none';  // Ocultar el botón de registro
  } else {
    profileButton.style.display = 'none';
    loginButton.style.display = 'block';
    ctaSection.style.display = 'block';  // Mostrar el botón de registro
  }
}

// Función para cerrar sesión
function toggleSession() {
  const token = localStorage.getItem('token');
  if (token) {
    localStorage.removeItem('token');
    checkAuthentication();  // Actualizar la UI después de cerrar sesión
  } else {
    window.location.href = 'login.html';  // Si no está autenticado, redirige al login
  }
}

// Funcionamiento de búsqueda
document.getElementById("search-form").addEventListener("submit", async function (event) {
  event.preventDefault();
  const query = document.getElementById("search-query").value.trim();
  if (!query) {
    alert("Por favor, ingresa un término de búsqueda.");
    return;
  }

  try {
    const response = await fetch(`https://bookswap-w7ze.onrender.com/api/search?query=${query}`);
    const data = await response.json();

    if (data && data.books.length > 0) {
      mostrarResultados(data.books);
    } else {
      alert("No se encontraron resultados para tu búsqueda.");
    }
  } catch (error) {
    console.error("Error al realizar la búsqueda:", error);
    alert("Ocurrió un error al buscar libros. Por favor, intenta de nuevo.");
  }
});

// Función para mostrar resultados
function mostrarResultados(books) {
  const resultadosContainer = document.getElementById("resultados-container");
  resultadosContainer.innerHTML = "";

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

// Función para ver el detalle de un libro
function verDetalleLibro(bookId) {
  window.location.href = `detalle-libro.html?id=${bookId}`;
}

// Ejecutar la verificación de autenticación cuando se cargue la página
checkAuthentication();