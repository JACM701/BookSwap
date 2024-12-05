const fs = require('fs');
const path = require('path');
const Book = require('../models/book'); // Asegúrate de importar el modelo aquí

const modelsPath = path.join(__dirname, '../models');
fs.readdir(modelsPath, (err, files) => {
  if (err) {
    console.error('Error al leer la carpeta models:', err);
  } else {
    console.log('Archivos en la carpeta models:', files);
  }
});

// Crear un libro
exports.createBook = async (req, res) => {
  const { title, author, genre, description, imageUrl } = req.body;

  // Validar los campos requeridos
  if (!title || !author || !genre || !description || !imageUrl) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const book = new Book({
      title,
      author,
      genre,
      description,
      imageUrl,
      user: req.user.id, // Asociar el libro al usuario autenticado
    });

    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.error('Error al crear un libro:', error); // Logging detallado
    res.status(500).json({ message: 'Error interno del servidor' });
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

// Obtener libros del usuario autenticado
exports.getUserBooks = async (req, res) => {
  try {
    const userId = req.user.id; // ID del usuario autenticado
    const books = await Book.find({ user: userId }).populate('user', 'name email'); // Filtrar por usuario
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los libros del usuario' });
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

//Buscar libro ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el libro", error: error.message });
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
    // Comparar correctamente el userId del libro con el userId del token
    if (book.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'No autorizado para actualizar este libro' });
    }

    // Actualizar los campos solo si se han proporcionado en la solicitud
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
