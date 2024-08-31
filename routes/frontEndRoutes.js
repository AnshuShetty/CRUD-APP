const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Import the User model
const session = require('express-session');
const bcrypt = require('bcrypt'); // For password hashing

// Render the login page
router.get('/login', (req, res) => {
    if (req.session.user) {
        // If the user is already authenticated, redirect to the dashboard
        return res.redirect('/books');
    }
    res.render('login', { error: null });
});


module.exports = router;
