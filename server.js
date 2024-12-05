const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./Routes/authRoutes');
const bookRoutes = require('./Routes/bookRoutes');
const commentRoutes = require('./Routes/commentRoutes');
const path = require('path');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_PATH || 'uploads')));

// Sirve archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Redirigir a login en lugar de enviar index.html
app.get('/', (req, res) => {
  res.redirect('/login.html'); // Redirige directamente a la página de login
});

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log('Conectado a MongoDB No le muevas papi'))
  .catch((err) => console.error('Error conectando a MongoDB: ¿Porque mierda le mueves?', err));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/comments', commentRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
