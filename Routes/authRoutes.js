const express = require('express');
const { register, login } = require('../controllers/authController');


const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Ruta para obtener el perfil del usuario autenticado
router.get('/profile', getProfile);

module.exports = router;
