// Función para procesar el formulario de registro
const registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("uname").value; // Cambié el ID a "uname" para que coincida
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  // Verifica que las contraseñas coincidan
  if (password !== confirmPassword) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  // Verifica que la contraseña tenga al menos 6 caracteres
  if (password.length < 6) {
    alert("La contraseña debe tener al menos 6 caracteres.");
    return;
  }

  try {
    const response = await fetch("https://bookswap-w7ze.onrender.com/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }), // Enviar "name" en lugar de "username"
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
