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
    fetch('https://bookswap-w7ze.onrender.com/api/books') // Cambia por tu URL si es necesario
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

        // Manejo de imagen: Usar una predeterminada si la imagen no está definida
        const bookImage = book.imageUrl || "https://via.placeholder.com/150?text=Sin+imagen";

        bookCard.innerHTML = `
            <img src="${bookImage}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <button class="view-more" 
                data-title="${book.title}" 
                data-author="${book.author}" 
                data-genre="${book.genre}" 
                data-description="${book.description}" 
                data-image="${bookImage}">
                Ver más
            </button>
        `;
        bookCardsContainer.appendChild(bookCard);
    });

    // Agregar eventos a los botones "Ver más"
    document.querySelectorAll('.view-more').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Evitar la recarga de la página
            const { title, author, genre, description, image } = event.target.dataset;
            showModal(title, author, genre, description, image);
        });
    });
}

// Función para mostrar el modal con más detalles del libro
// Función para mostrar el modal con más detalles del libro
function showModal(title, author, genre, description, image) {
  document.getElementById("bookTitle").textContent = title;
  document.getElementById("bookAuthor").textContent = author;
  document.getElementById("bookGenre").textContent = genre;
  document.getElementById("bookDescription").textContent = description;

  // Manejo de imagen en el modal
  const modalImage = image || "https://via.placeholder.com/150?text=Sin+imagen";
  document.getElementById("bookImage").src = modalImage;

  // Cambiar el texto y el enlace del botón
  const modalButton = document.querySelector("#bookModal button");
  modalButton.textContent = "Pedir Información";
  modalButton.onclick = () => {
      window.location.href = "https://app.flutterflow.io/share/bookswap-ell3b6?page=INICIO";
  };

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
