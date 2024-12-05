const express = require('express');
const { register, login } = require('../controllers/authController');
const protect = require('../middleware/protect'); // Verifica que la ruta sea correcta

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Ruta para obtener el perfil del usuario autenticado
router.get('/profile', protect, getProfile);

module.exports = router;
