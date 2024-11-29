const Book = require('../models/Book');

exports.createBook = async (req, res) => {
    const { title, author, description, genre, year, imageUrl } = req.body;
    try {
        const newBook = new Book({
            title,
            author,
            description,
            genre,
            year,
            imageUrl,
            user: req.user.id
        });
        await newBook.save();
        res.status(201).json({ message: 'Libro creado exitosamente', book: newBook });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear el libro' });
    }
};

exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find().populate('user', 'nombre email');
        res.status(200).json(books);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los libros' });
    }
};

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('user', 'nombre email');
        if (!book) return res.status(404).json({ error: 'Libro no encontrado' });
        res.status(200).json(book);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener el libro' });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ error: 'Libro no encontrado' });
        if (book.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'No tienes permisos para actualizar este libro' });
        }
        Object.assign(book, req.body);
        await book.save();
        res.status(200).json({ message: 'Libro actualizado exitosamente', book });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar el libro' });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ error: 'Libro no encontrado' });
        if (book.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'No tienes permisos para eliminar este libro' });
        }
        await book.remove();
        res.status(200).json({ message: 'Libro eliminado exitosamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar el libro' });
    }
};
