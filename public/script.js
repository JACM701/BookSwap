// Función para redirigir a la página correspondiente cuando se hace clic en un botón
function redirectTo(page) {
  window.location.href = page;
}

// --- FUNCIONES PARA FORMULARIOS ---

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");

  if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;
      const errorMsg = document.getElementById("register-error");

      if (password !== confirmPassword) {
        errorMsg.textContent = "Las contraseñas no coinciden.";
        return;
      }

      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        if (response.ok) {
          alert("Usuario registrado con éxito");
          window.location.href = "login.html";
        } else {
          errorMsg.textContent = data.message || "Error en el registro.";
        }
      } catch (error) {
        errorMsg.textContent = "Error de conexión, intenta de nuevo.";
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const errorMsg = document.getElementById("login-error");

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
          localStorage.setItem("token", data.token);
          alert("Inicio de sesión exitoso");
          window.location.href = "perfil.html";
        } else {
          errorMsg.textContent = data.message || "Credenciales incorrectas.";
        }
      } catch (error) {
        errorMsg.textContent = "Error de conexión, intenta de nuevo.";
      }
    });
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
