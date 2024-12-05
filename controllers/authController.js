const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Registro de usuario
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Verifica si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Crea un nuevo usuario
    const user = new User({ name, email, password });
    await user.save();

    // Devuelve un mensaje de éxito, pero no un token
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Inicio de sesión
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Verifica si el usuario existe
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    // Genera un token para el usuario
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Obtener el perfil del usuario
exports.getProfile = async (req, res) => {
  try {
    const user = req.user; // Ya lo tenemos disponible en req.user gracias al middleware protect
    res.status(200).json({
      name: user.name,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
