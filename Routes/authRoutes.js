const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');  // Importa getProfile
const protect = require('../middleware/authMiddleware');  // Asegúrate de importar el middleware de protección si lo estás utilizando

const router = express.Router();

// Ruta de registro
router.post('/register', register);

// Ruta de login
router.post('/login', login);

// Ruta para obtener el perfil del usuario autenticado
router.get('/profile', protect, getProfile);  // Asegúrate de usar el middleware 'protect'

module.exports = router;
