require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const path = require('path');

// connect to DB
require('./config/database');

const app = express();
app.use(logger('dev'));
app.use(express.json());

// Configure static middleware
// to serve from the production 'dist' folder
app.use(express.static(path.join(__dirname, 'dist')));

// Put API routes here, before the "catch all" route
app.use('/api/items', require('./routes/api/items'));

// The following "catch all" route (note the *) is necessary
// to return the index.html on all non-AJAX requests
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log(`Express app running on port ${port}`)
});