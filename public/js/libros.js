document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("⚠️ No se encontró un token. Asegúrate de haber iniciado sesión.");
      return;
    }
  
    try {
      const response = await fetch("https://bookswap-w7ze.onrender.com/api/auth/profile", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        alert(`❌ Error al cargar el perfil: ${response.statusText}`);
        return;
      }
  
      const data = await response.json();
      document.getElementById("username").textContent = data.name;
      document.getElementById("email").textContent = data.email;
  
      // Cargar los libros del usuario
      await getBooks();
    } catch (error) {
      alert("❌ Error de conexión al cargar el perfil.");
      console.error("Error:", error);
    }
  });

  async function getBooks() {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("⚠️ No se encontró un token.");
      return;
    }
  
    try {
      const response = await fetch("https://bookswap-w7ze.onrender.com/api/books/user", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        alert(`❌ Error al cargar los libros: ${response.statusText}`);
        return;
      }
  
      const books = await response.json();
      displayBooks(books);
    } catch (error) {
      alert("❌ Error al obtener los libros.");
      console.error("Error:", error);
    }
  }
  
  document.getElementById("addBookForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ No estás autenticado.");
      return;
    }
  
    const newBook = {
      title: document.getElementById("title").value,
      author: document.getElementById("author").value,
      genre: document.getElementById("genre").value,
      description: document.getElementById("description").value,
      imageUrl: document.getElementById("imageUrl").value,
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
  
      if (!response.ok) {
        alert(`❌ Error al agregar el libro: ${response.statusText}`);
        return;
      }
  
      alert("✅ Libro añadido con éxito.");
      const addedBook = await response.json();
      appendBookToList(addedBook);
    } catch (error) {
      alert("❌ Error al agregar el libro.");
      console.error("Error:", error);
    }
  });
  
  async function editBook(bookId) {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("⚠️ No estás autenticado.");
      return;
    }
  
    try {
      const response = await fetch(`https://bookswap-w7ze.onrender.com/api/books/${bookId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        alert(`❌ Error al obtener los datos del libro: ${response.statusText}`);
        return;
      }
  
      const book = await response.json();
  
      document.getElementById("editTitle").value = book.title;
      document.getElementById("editAuthor").value = book.author;
      document.getElementById("editGenre").value = book.genre;
      document.getElementById("editDescription").value = book.description;
      document.getElementById("editImageUrl").value = book.imageUrl;
  
      document.getElementById("editBookModal").style.display = "flex";
  
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
  
          if (!updateResponse.ok) {
            alert(`❌ Error al actualizar el libro: ${updateResponse.statusText}`);
            return;
          }
  
          alert("✅ Libro actualizado con éxito.");
          document.getElementById("editBookModal").style.display = "none";
          await getBooks();
        } catch (error) {
          alert("❌ Error al actualizar el libro.");
          console.error("Error:", error);
        }
      };
    } catch (error) {
      alert("❌ Error al obtener el libro.");
      console.error("Error:", error);
    }
  }

  async function deleteBook(bookId) {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("⚠️ No estás autenticado.");
      return;
    }
  
    try {
      const response = await fetch(`https://bookswap-w7ze.onrender.com/api/books/${bookId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        alert(`❌ Error al eliminar el libro: ${response.statusText}`);
        return;
      }
  
      alert("✅ Libro eliminado con éxito.");
      await getBooks();
    } catch (error) {
      alert("❌ Error al eliminar el libro.");
      console.error("Error:", error);
    }
  }
  
  function displayBooks(books) {
    const bookList = document.getElementById("book-list");
    bookList.innerHTML = ""; // Limpiamos la lista antes de agregar libros
  
    books.forEach(book => {
      const bookElement = document.createElement("div");
      bookElement.classList.add("book-item");
      bookElement.innerHTML = `
        <h4>${book.title}</h4>
        <p><strong>Autor:</strong> ${book.author}</p>
        <p><strong>Género:</strong> ${book.genre}</p>
        <p>${book.description}</p>
        <img src="${book.imageUrl}" alt="Imagen de ${book.title}" />
        <button class="edit-btn" onclick="editBook('${book._id}')">Editar</button>
        <button class="delete-btn" onclick="openDeleteModal('${book._id}')">Eliminar</button>
      `;
  
      bookList.appendChild(bookElement);
    });
  }
  
  // Abrir el modal de confirmación de eliminación
  function openDeleteModal(bookId) {
    const deleteModal = document.getElementById("deleteBookModal");
    deleteModal.style.display = "flex";
  
    // Agregar el evento al botón de confirmar eliminación
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    confirmDeleteBtn.onclick = async () => {
      await deleteBook(bookId); // Llamar a la función para eliminar el libro
      closeModal();
    };
  }
  
  // Cerrar todos los modales
  function closeModal() {
    const modals = document.querySelectorAll(".modal");
    modals.forEach(modal => (modal.style.display = "none"));
  }
  