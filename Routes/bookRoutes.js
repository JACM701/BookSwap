const express = require('express');
const {
  createBook,
  getBooks,
  updateBook,
  deleteBook,
  searchBooks,
} = require('../controllers/bookController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createBook); // Crear libro
router.get('/', getBooks); // Obtener libros
router.get('/search', searchBooks); // Buscar libros
router.put('/:id', protect, updateBook); // Actualizar libro
router.delete('/:id', protect, deleteBook); // Eliminar libro

module.exports = router;
