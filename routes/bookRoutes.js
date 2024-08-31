const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// READ: Retrieve all books
router.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.render('books', { books }); // Render 'books.ejs' and pass the books data
    } catch (error) {
        res.status(500).send('Error retrieving books');
    }
});

// CREATE: Show form to add a new book
router.get('/books/new', (req, res) => {
    res.render('newBook'); // Render the 'newBook.ejs' form
});

// CREATE: Add a new book
router.post('/books', async (req, res) => {
    try {
        const { title, author } = req.body;
        const book = new Book({ title, author });
        await book.save();
        res.redirect('/books');
    } catch (error) {
        res.status(400).send('Error creating book');
    }
});

// UPDATE: Show form to edit an existing book
router.get('/books/edit/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id); // Corrected to findById
        if (!book) return res.status(404).send('Book not found');
        res.render('editBook', { book }); // Render the 'editBook.ejs' form
    } catch (error) {
        res.status(404).send('Book not found');
    }
});

// UPDATE: Edit an existing book
router.put('/books/:id', async (req, res) => {
    try {
        const { title, author } = req.body;
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            { title, author },
            { new: true, runValidators: true }
        );
        if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
        res.redirect('/books');
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE: Delete a book
// DELETE: Delete a book
router.delete('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        // res.json({ message: 'Book deleted successfully' });
        res.redirect('/books');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
