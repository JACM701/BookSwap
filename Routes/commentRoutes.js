const express = require('express');
const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} = require('../controllers/commentController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createComment); // Crear comentario
router.get('/', protect, getComments); // Obtener comentarios
router.put('/:id', protect, updateComment); // Editar comentario
router.delete('/:id', protect, deleteComment); // Eliminar comentario

module.exports = router;
