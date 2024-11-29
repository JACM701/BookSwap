const Comment = require('../models/Comment');
const Book = require('../models/Book');

// Crear comentario
exports.createComment = async (req, res) => {
    const { bookId, text } = req.body;
    try {
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ error: 'Libro no encontrado' });

        const newComment = new Comment({
            text,
            book: bookId,
            user: req.user.id,
        });

        await newComment.save();
        res.status(201).json({ message: 'Comentario creado exitosamente', comment: newComment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear el comentario' });
    }
};

// Obtener comentarios de un libro
exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ book: req.params.bookId })
            .populate('user', 'nombre email')
            .populate('book', 'title');
        res.status(200).json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los comentarios' });
    }
};

// Actualizar comentario
exports.updateComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ error: 'Comentario no encontrado' });

        if (comment.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'No tienes permisos para actualizar este comentario' });
        }

        comment.text = req.body.text;
        await comment.save();
        res.status(200).json({ message: 'Comentario actualizado exitosamente', comment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar el comentario' });
    }
};

// Eliminar comentario
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ error: 'Comentario no encontrado' });

        if (comment.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'No tienes permisos para eliminar este comentario' });
        }

        await comment.remove();
        res.status(200).json({ message: 'Comentario eliminado exitosamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar el comentario' });
    }
};
