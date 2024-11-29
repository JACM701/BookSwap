const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3000;
const JWT_SECRET = "sueñitosTieneHambreTodoElTiempo"; // Cambiar por una más segura en producción

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conectar a MongoDB Atlas
mongoose
  .connect("mongodb+srv://Jacm701:SueñitosTieneHambreTodoElTiempo@bookswap.cuqet.mongodb.net/bookSwapDB?retryWrites=true&w=majority&appName=BookSwap", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch((err) => console.error("Error al conectar con MongoDB:", err));

// Modelo de Usuario
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' } // Agregamos el campo de rol
});

const User = mongoose.model("User", UserSchema);

// Ruta para el registro de usuario
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).send("Usuario registrado con éxito");
  } catch (err) {
    res.status(400).send("Error al registrar usuario: " + err.message);
  }
});

// Ruta para login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("Usuario no encontrado");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send("Credenciales incorrectas");

    // Crear token JWT
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).send("Error al iniciar sesión: " + err.message);
  }
});

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).send("Token requerido");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role; // Añadimos el rol del usuario
    next();
  } catch {
    res.status(401).send("Token inválido o expirado");
  }
};

// Ruta para el perfil de usuario (solo accesible con token)
app.get("/perfil", authMiddleware, (req, res) => {
  res.send("Acceso permitido: datos del perfil.");
});

// Ruta para el área administrativa (solo accesible para administradores)
app.get("/admin", authMiddleware, (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).send("Acceso restringido a administradores");
  }
  res.send("Acceso administrativo: gestionar usuarios e intercambios");
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
