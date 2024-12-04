const path = require('path');
const Book = require(path.join(__dirname, '../models/Book'));


// Crear un libro
exports.createBook = async (req, res) => {
  const { title, author, genre, description, imageUrl } = req.body;
  try {
    const book = new Book({
      title,
      author,
      genre,
      description,
      imageUrl,
      user: req.user.id,
    });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los libros (con filtros opcionales)
exports.getBooks = async (req, res) => {
  const { genre } = req.query; // Filtro opcional por género
  try {
    const books = await Book.find(genre ? { genre } : {}).populate('user', 'name email');
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Buscar libros (título o autor)
exports.searchBooks = async (req, res) => {
  const { query } = req.query; // Obtenemos el término de búsqueda
  try {
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { genre: { $regex: query, $options: 'i' } },
      ],
    }).populate('user', 'name email');
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Actualizar un libro
exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, genre, description, imageUrl } = req.body;
  try {
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    // Verificar que el usuario que intenta actualizar es el propietario
    if (book.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'No autorizado para actualizar este libro' });
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.genre = genre || book.genre;
    book.description = description || book.description;
    book.imageUrl = imageUrl || book.imageUrl;

    const updatedBook = await book.save();
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un libro
exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    // Verificar que el usuario que intenta eliminar es el propietario
    if (book.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'No autorizado para eliminar este libro' });
    }

    await book.deleteOne();
    res.status(200).json({ message: 'Libro eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
