const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bookRoutes = require('./routes/bookRoutes');
const frontendRoutes = require('./routes/frontendRoutes'); // This will handle API routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology:true})
.then(()=>console.log('Connected to MongoDb'))
.catch(err=>console.log(err));



// Define the main route to render the frontend
app.get('/', (req, res) => {
    res.redirect('/books');
});

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.use('/', frontendRoutes);

// Use API routes
app.use('/', bookRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});