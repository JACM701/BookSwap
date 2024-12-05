// Función para redirigir a la página correspondiente cuando se hace clic en un botón
function redirectTo(page) {
    window.location.href = page;
  }
  
  // Función para procesar el formulario de login
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
  