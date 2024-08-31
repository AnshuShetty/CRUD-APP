const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user'); // Replace with the correct path to your User model

// Render the login page
router.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard'); // Redirect to the dashboard if the user is already logged in
    }
    res.render('login', { error: null }); // Render the login page with no error initially
});

// Handle login logic
router.post('/login', async (req, res) => {
    const { name, password } = req.body;
    
    try {
        const user = await User.findOne({ name }); // Find user by name
        
        if (user && await bcrypt.compare(password, user.password)) {
            // Set session for the logged-in user
            req.session.user = user.name; // Corrected from 'user.username' to 'user.name'
            console.log('Login successful!');
            return res.redirect('/books'); // Redirect to /books after successful login
        } else {
            res.render('login', { error: 'Invalid credentials!' }); // Render login page with error
        }
    } catch (err) {
        console.error(err); // Log any error for debugging
        res.status(500).send('Error occurred while logging in.'); // Send generic error message
    }
});

// Handle logout logic
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error during logout:', err); // Log any error for debugging
            return res.redirect('/dashboard'); // Redirect to dashboard if error occurs
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.redirect('/login'); // Redirect to login page
    });
});

// Render the registration page
router.get('/register', (req, res) => {
    res.render('registration', { error: null }); // Render registration page with no error initially
});

// Handle registration logic
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ name }); // Check if a user with the given name already exists
        if (existingUser) {
            return res.render('registration', { error: 'User already exists!' }); // Render registration page with error
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hash the user's password
        const newUser = new User({ name, email, password: hashedPassword }); // Create a new user
        await newUser.save(); // Save the new user to the database
        res.redirect('/login'); // Redirect to login page after successful registration
    } catch (err) {
        console.error(err); // Log any error for debugging
        res.status(500).render('registration', { error: 'Error occurred during registration.' }); // Render registration page with error
    }
});



module.exports = router;
