const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true }, // Relación con el libro
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Relación con el usuario
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
