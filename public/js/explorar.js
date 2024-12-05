let allBooks = []; // Variable para almacenar todos los libros obtenidos

// Función para manejar el cierre de sesión
function toggleSession() {
    localStorage.removeItem('token'); // Elimina el token del almacenamiento
    window.location.href = 'login.html'; // Redirige al login después de cerrar sesión
}

// Eventos de los botones
document.getElementById("btnInicio").addEventListener("click", () => {
  window.location.href = "index.html";
});

document.getElementById("btnPerfil").addEventListener("click", () => {
  window.location.href = "perfil.html";
});

document.getElementById("btnComunidad").addEventListener("click", () => {
  window.location.href = "comunidad.html";
});

document.getElementById("btnCerrarSesion").addEventListener("click", () => {
  toggleSession();
});

// Función para cargar libros desde la API
function fetchBooks() {
  fetch('https://api-bookswap.onrender.com/api/books') // Cambia por tu URL si es necesario
    .then(response => {
      if (!response.ok) {
        throw new Error('No se pudo cargar los libros');
      }
      return response.json();
    })
    .then(data => {
      allBooks = data; // Almacenar todos los libros
      displayBooks(allBooks); // Mostrar todos los libros al inicio
    })
    .catch(error => {
      console.error('Error al cargar los libros:', error);
      alert('Error al cargar los libros. Por favor, inténtalo nuevamente.');
    });
}

// Función para mostrar los libros en la página
function displayBooks(booksToDisplay) {
  const bookCardsContainer = document.getElementById("bookCards");
  bookCardsContainer.innerHTML = ""; // Limpiar los libros previos

  booksToDisplay.forEach(book => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");
    bookCard.innerHTML = `
      <img src="${book.image}" alt="${book.title}">
      <h3>${book.title}</h3>
      <p>${book.author}</p>
      <button class="view-more" data-title="${book.title}" data-author="${book.author}" data-genre="${book.genre}" data-description="${book.description}" data-image="${book.image}">Ver más</button>
    `;
    bookCardsContainer.appendChild(bookCard);
  });

  // Agregar eventos a los botones "Ver más"
  document.querySelectorAll('.view-more').forEach(button => {
    button.addEventListener('click', (event) => {
      const { title, author, genre, description, image } = event.target.dataset;
      showModal(title, author, genre, description, image);
    });
  });
}

// Función para mostrar el modal con más detalles del libro
function showModal(title, author, genre, description, image) {
  document.getElementById("bookTitle").textContent = title;
  document.getElementById("bookAuthor").textContent = author;
  document.getElementById("bookGenre").textContent = genre;
  document.getElementById("bookDescription").textContent = description;
  document.getElementById("bookImage").src = image;
  document.getElementById("bookModal").style.display = "block";
}

// Función para cerrar el modal
function closeModal() {
  document.getElementById("bookModal").style.display = "none";
}

document.getElementById("bookModal").addEventListener('click', (event) => {
  if (event.target === document.getElementById("bookModal")) {
    closeModal();
  }
});

// Función para filtrar libros por género
function filterBooksByGenre(genre) {
  const filteredBooks = genre === 'Todos' ? allBooks : allBooks.filter(book => book.genre === genre);
  displayBooks(filteredBooks);
}

// Llamada inicial para cargar los libros
fetchBooks(); 
