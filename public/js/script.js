// Función para redirigir a la página correspondiente cuando se hace clic en un botón
function redirectTo(page) {
  window.location.href = page;
}

// --- FUNCIONES PARA FORMULARIOS ---
const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("https://bookswap-w7ze.onrender.com/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "perfil.html"; // Redirigir a la página de perfil
    } else {
      alert(data.message); // Mostrar mensaje de error
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

//Registro
const registroForm = document.getElementById("register-form");

registroForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  // Verifica que las contraseñas coincidan
  if (password !== confirmPassword) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  try {
    const response = await fetch("https://bookswap-w7ze.onrender.com/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      window.location.href = "login.html"; // Redirigir a login
    } else {
      alert(data.message); // Mostrar mensaje de error
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

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

const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "login.html"; // Redirigir si no está autenticado
}

// Obtener los libros del usuario
async function getBooks() {
  try {
    const response = await fetch("https://bookswap-w7ze.onrender.com/api/books", {
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
  const booksList = document.getElementById("booksList");
  booksList.innerHTML = ""; // Limpiar lista antes de agregar

  books.forEach((book) => {
    const li = document.createElement("li");
    li.textContent = `${book.title} by ${book.author}`;
    booksList.appendChild(li);
  });
}

// Llamar a getBooks para cargar los libros
getBooks();

//Agragr libros desde ID
const addBookForm = document.getElementById("addBookForm");

  addBookForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const genre = document.getElementById("genre").value;
    const description = document.getElementById("description").value;
    const imageUrl = document.getElementById("imageUrl").value;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("https://bookswap-w7ze.onrender.com/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ title, author, genre, description, imageUrl }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Libro agregado con éxito");
        window.location.reload(); // Recargar la página para mostrar el libro agregado
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });