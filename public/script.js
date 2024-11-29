// Función para redirigir a la página correspondiente cuando se hace clic en un botón
function redirectTo(page) {
  window.location.href = page;
}

// --- FUNCIONES PARA FORMULARIOS ---

// Función de validación y registro de nuevo usuario
document.addEventListener("DOMContentLoaded", function() {
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", async function(event) {
      event.preventDefault();

      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      // Validación de campos
      if (!username || !email || !password || !confirmPassword) {
        alert("Por favor, completa todos los campos.");
        return;
      }

      if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
      }

      // Enviar la solicitud de registro
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();
      if (response.status === 201) {
        alert("Usuario registrado con éxito");
        window.location.href = "login.html"; // Redirigir al login
      } else {
        alert(data.message);
      }
    });
  }
});

// Función de validación para el inicio de sesión
document.getElementById("login-form").addEventListener("submit", async function(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Validación de campos
  if (!email || !password) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  // Enviar la solicitud de inicio de sesión
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  if (response.status === 200) {
    localStorage.setItem("token", data.token); // Guardar el token en localStorage
    alert("¡Inicio de sesión exitoso!");
    window.location.href = "perfil.html"; // Redirigir al perfil
  } else {
    alert(data.message);
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

// Lógica para agregar libros al sistema
document.getElementById("add-book-form").addEventListener("submit", async function(event) {
  event.preventDefault();

  // Obtener valores del formulario
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const genre = document.getElementById("genre").value;
  const description = document.getElementById("description").value;
  const image = document.getElementById("image").value;

  // Enviar la solicitud para agregar un libro
  const response = await fetch("/books", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ title, author, genre, description, image })
  });

  const data = await response.json();
  alert(data.message || "Libro agregado con éxito");
});
