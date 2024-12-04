const Comment = require('../models/Comment');

// Crear un comentario
exports.createComment = async (req, res) => {
  const { content, bookId, isCommunity } = req.body;

  try {
    const comment = new Comment({
      content,
      bookId: isCommunity ? null : bookId, // Si es para comunidad, bookId será null
      isCommunity,
      userId: req.user.id,
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener comentarios (por libro o comunidad)
exports.getComments = async (req, res) => {
  const { bookId, isCommunity } = req.query;

  try {
    const filter = isCommunity
      ? { isCommunity: true }
      : { bookId, isCommunity: false };

    const comments = await Comment.find(filter).populate('userId', 'name email');
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Editar un comentario
exports.updateComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado para editar este comentario' });
    }

    comment.content = content;
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un comentario
exports.deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado para eliminar este comentario' });
    }

    // Usamos deleteOne() en lugar de remove()
    await Comment.deleteOne({ _id: id });

    res.status(200).json({ message: 'Comentario eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

