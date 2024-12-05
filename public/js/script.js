// Función para redirigir a la página correspondiente cuando se hace clic en un botón
function redirectTo(page) {
  window.location.href = page;
}
// --- FUNCIONES DE NAVEGACIÓN ---

// Función para mostrar mensajes de alerta cuando el usuario navega por el sitio
document.querySelectorAll('.cta').forEach(function(button) {
  button.addEventListener('click', function(event) {
    const page = event.target.closest('button').querySelector('span').textContent;
    alert(`Estás navegando a la sección: ${page}`);
  });
});

// Función de redirección cuando el usuario hace clic en el botón "Iniciar sesión"
document.querySelector('.login-btn')?.addEventListener('click', function() {
  redirectTo('login.html');
});

// Función de redirección cuando el usuario hace clic en "Registrarse" desde el login
document.querySelector('.register-btn')?.addEventListener('click', function() {
  redirectTo('registro.html');
});

// Función de redirección cuando el usuario hace clic en "Volver al login" desde el registro
document.querySelector('.back-to-login')?.addEventListener('click', function() {
  redirectTo('login.html');
});

// Agregar event listeners a los enlaces de navegación en el footer
document.querySelectorAll('footer a').forEach(function(link) {
  link.addEventListener('click', function(event) {
    event.preventDefault();
    const page = event.target.getAttribute('href');
    alert(`Estás navegando a la página: ${page}`);
    redirectTo(page);
  });
});

// --- FUNCIONES PARA LIBROS ---
// Obtener los libros del usuario
async function getBooks() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html"; // Redirigir si no está autenticado
  }

  try {
    const response = await fetch("https://bookswap-w7ze.onrender.com/api/books/user", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const books = await response.json();
    displayBooks(books);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Mostrar los libros en el perfil
function displayBooks(books) {
  const booksList = document.getElementById("book-list");
  booksList.innerHTML = ""; // Limpiar lista antes de agregar

  books.forEach((book) => {
    const bookDiv = document.createElement("div");
    bookDiv.classList.add("book-item");
    bookDiv.innerHTML = `
      <h4>${book.title} by ${book.author}</h4>
      <p>${book.genre}</p>
      <p>${book.description}</p>
      <img src="${book.imageUrl}" alt="Book image" width="100">
      <button onclick="editBook('${book._id}')">Editar</button>
      <button onclick="deleteBook('${book._id}')">Eliminar</button>
    `;
    booksList.appendChild(bookDiv);
  });
}

// Editar un libro
async function editBook(bookId) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`https://bookswap-w7ze.onrender.com/api/books/${bookId}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    const book = await response.json();

    // Rellenar el formulario del modal con los datos del libro
    document.getElementById("editTitle").value = book.title;
    document.getElementById("editAuthor").value = book.author;
    document.getElementById("editGenre").value = book.genre;
    document.getElementById("editDescription").value = book.description;
    document.getElementById("editImageUrl").value = book.imageUrl;

    // Abrir el modal
    document.getElementById("editBookModal").style.display = "flex";

    // Guardar cambios
    document.getElementById("editBookForm").onsubmit = async (e) => {
      e.preventDefault();

      const updatedBook = {
        title: document.getElementById("editTitle").value,
        author: document.getElementById("editAuthor").value,
        genre: document.getElementById("editGenre").value,
        description: document.getElementById("editDescription").value,
        imageUrl: document.getElementById("editImageUrl").value,
      };

      try {
        const updateResponse = await fetch(`https://bookswap-w7ze.onrender.com/api/books/${bookId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(updatedBook),
        });

        if (updateResponse.ok) {
          alert("Libro actualizado con éxito");
          window.location.reload();
        } else {
          alert("Error al actualizar el libro");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
  } catch (error) {
    console.error("Error:", error);
  }
}

// Eliminar un libro
async function deleteBook(bookId) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`https://bookswap-w7ze.onrender.com/api/books/${bookId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (response.ok) {
      alert("Libro eliminado con éxito");
      window.location.reload(); // Recargar para reflejar los cambios
    } else {
      alert("Error al eliminar el libro");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Cerrar el modal
function closeModal() {
  document.getElementById("editBookModal").style.display = "none";
}

// Llamar a getBooks para cargar los libros al cargar la página
getBooks();