const express = require('express');
const {
  createBook,
  getBooks,
  updateBook,
  deleteBook,
  searchBooks,
  getUserBooks,
} = require('../controllers/bookController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createBook); // Crear libro
router.get('/', getBooks); // Obtener libros
router.get('/search', searchBooks); // Buscar libros
router.get('/user', protect, getUserBooks); // Obtener libros del usuario autenticado
router.put('/:id', protect, updateBook); // Actualizar libro
router.delete('/:id', protect, deleteBook); // Eliminar libro

module.exports = router;
