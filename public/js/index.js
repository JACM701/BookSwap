// Verificar si el usuario está autenticado al cargar la página
function checkAuthentication() {
  const token = localStorage.getItem('token'); // Suponiendo que guardas el token en localStorage
  const profileButton = document.querySelector('button.cta[onclick*="redirectTo(\'perfil.html\')"]');
  const loginButton = document.querySelector('.login-btn');

  // Si el token existe, el usuario está autenticado
  if (token) {
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

// Ejecutar la verificación de autenticación cuando se cargue la página
document.addEventListener("DOMContentLoaded", checkAuthentication);
