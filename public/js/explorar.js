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

document.getElementById("btnBlog").addEventListener("click", () => {
  window.location.href = "blog.html";
});

document.getElementById("btnCerrarSesion").addEventListener("click", () => {
  toggleSession();
});

// Función para cargar libros desde la API
function fetchBooks() {
  fetch('https://api-bookswap.onrender.com/api/books')  // Asegúrate de que esta URL sea la correcta para tu API
    .then(response => response.json())
    .then(data => {
      // Mostrar los libros después de obtenerlos
      displayBooks(data);
    })
    .catch(error => {
      console.error('Error al cargar los libros:', error);
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
      <button onclick="showModal('${book.title}', '${book.author}', '${book.genre}', '${book.description}', '${book.image}')">Ver más</button>
    `;
    bookCardsContainer.appendChild(bookCard);
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

// Función para filtrar libros por género
function filterBooksByGenre(genre) {
  fetch(`https://api-bookswap.onrender.com/api/books?genre=${genre}`)
    .then(response => response.json())
    .then(data => displayBooks(data))
    .catch(error => console.error('Error al filtrar los libros:', error));
}

// Llamada inicial para cargar los libros
fetchBooks();