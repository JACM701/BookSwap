// Función para redirigir a la página correspondiente cuando se hace clic en un botón
function redirectTo(page) {
    window.location.href = page;
  }
  
  // Función para procesar el formulario de login
  document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("No estás autenticado. Redirigiendo al login...");
      window.location.href = "login.html";
      return;
    }
  
    try {
      const response = await fetch("https://bookswap-w7ze.onrender.com/api/auth/profile", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`, // Incluye el token en el encabezado
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        document.getElementById("user-name").textContent = data.name;
        document.getElementById("user-email").textContent = data.email;
      } else {
        alert(data.message || "Hubo un problema al obtener tu perfil. Por favor, inicia sesión nuevamente.");
        localStorage.removeItem("token"); // Limpia el token inválido
        window.location.href = "login.html";
      }
    } catch (error) {
      alert("Error al cargar el perfil. Por favor, inténtalo más tarde.");
      console.error("Error:", error);
    }
  });
  