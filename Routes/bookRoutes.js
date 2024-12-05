const express = require('express');
const {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  searchBooks,
  getUserBooks,
} = require('../controllers/bookController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Rutas protegidas
router.post('/', protect, createBook); // Crear libro
router.get('/user', protect, getUserBooks); // Obtener libros del usuario autenticado
router.put('/:id', protect, updateBook); // Actualizar libro
router.delete('/:id', protect, deleteBook); // Eliminar libro

// Rutas públicas
router.get('/', getBooks); // Obtener libros
router.get('/:id', getBookById); // Obtener libro por ID
router.get('/search', searchBooks); // Buscar libros

module.exports = router;
