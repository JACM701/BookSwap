// Función para procesar el formulario de login
const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  try {
    const response = await fetch("https://bookswap-w7ze.onrender.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Inicio de sesión exitoso. Redirigiendo a la página principal...");
      localStorage.setItem("token", data.token);  // Guardar token en localStorage
      localStorage.setItem("userId", data.user._id);  // Guardar userId en localStorage
      window.location.href = "index.html"; // Redirigir al index.html
    } else {
      alert(data.message || "Error en las credenciales. Por favor, verifica tus datos.");
    }
  } catch (error) {
    alert("Ocurrió un error al iniciar sesión. Inténtalo nuevamente más tarde.");
    console.error("Error:", error);
  }
});
