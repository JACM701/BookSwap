const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Esquema de Usuario
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }, // Rol del usuario (puede ser 'user', 'admin', etc.)
}, {
    timestamps: true // Para mantener el seguimiento de la creación y actualización
});

// Encriptar la contraseña antes de guardarla en la base de datos
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Solo encripta si la contraseña ha cambiado
    this.password = await bcrypt.hash(this.password, 10); // Encriptamos la contraseña
    next();
});

// Método para comparar contraseñas (utilizado en el login)
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password); // Compara la contraseña ingresada con la almacenada
};

// Crear el modelo de Usuario
const User = mongoose.model('User', userSchema);

module.exports = User;
