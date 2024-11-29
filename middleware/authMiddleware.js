const jwt = require('jsonwebtoken');

// Clave secreta para verificar el token
const JWT_SECRET = process.env.JWT_SECRET || 'SueñitosTieneHambreTodoElTiempo';

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado, no hay token' });
    }

    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Guardamos la información del usuario en la solicitud
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

module.exports = authMiddleware;
