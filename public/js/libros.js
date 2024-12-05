// Obtener los libros del usuario
export async function getBooks() {
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
  
      if (!response.ok) {
        throw new Error('No se pudo obtener los libros');
      }
  
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
  export async function editBook(bookId) {
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
  export async function deleteBook(bookId) {
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
  export function closeModal() {
    document.getElementById("editBookModal").style.display = "none";
  }
  
  // Añadir un nuevo libro
  export async function addBook() {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "login.html"; // Redirigir si no está autenticado
    }
  
    // Obtener los valores del formulario de nuevo libro
    const newBook = {
      title: document.getElementById("newTitle").value,
      author: document.getElementById("newAuthor").value,
      genre: document.getElementById("newGenre").value,
      description: document.getElementById("newDescription").value,
      imageUrl: document.getElementById("newImageUrl").value,
    };
  
    try {
      const response = await fetch("https://bookswap-w7ze.onrender.com/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newBook),
      });
  
      if (response.ok) {
        alert("Libro añadido con éxito");
        window.location.reload(); // Recargar para reflejar el libro recién añadido
      } else {
        alert("Error al añadir el libro");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  