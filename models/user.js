const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true } // Store the hashed password
});

module.exports = mongoose.model('User', userSchema);
