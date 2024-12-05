//public/js/index.js
// Función para redirigir a otras páginas
function redirectTo(page) {
  window.location.href = page;
}


//Funcionamiento de buscar
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


/* AQUI abajo estaba la logica de sanchez anterior Que era basica sin usar DB
// Manejo de la búsqueda en la barra de búsqueda en la sección hero
document.querySelector('.search-form').addEventListener('submit', function(event) {
  event.preventDefault();  // Evitar el comportamiento por defecto del formulario
  const searchTerm = document.querySelector('.search-form input').value.trim().toLowerCase();
  
  if (searchTerm) {
    // Aquí podrías redirigir a una página de resultados con la búsqueda realizada
    window.location.href = `resultados.html?q=${searchTerm}`;
  } else {
    // Si el campo está vacío, muestra un mensaje o alerta
    alert("Por favor, ingresa un término de búsqueda.");
  }
});
*/
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
