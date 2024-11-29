const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Cargar las variables de entorno
dotenv.config();

// Crear la aplicación Express
const app = express();

// Middleware para poder parsear JSON en las solicitudes
app.use(express.json());
app.use(cors());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conexión a la base de datos exitosa'))
    .catch(err => console.log('Error al conectar a la base de datos', err));

// Importar las rutas
const authRoutes = require('./Routes/authRoutes');
const bookRoutes = require('./Routes/bookRoutes');

// Usar las rutas
app.use('/api/auth', authRoutes);  // Rutas de autenticación
app.use('/api/books', bookRoutes); // Rutas de libros

// Puerto donde corre el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
