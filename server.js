require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const path = require('path');
const swaggerSetup = require('./swagger');

// connect to DB
require('./config/database');

const app = express();
app.use(logger('dev'));
app.use(express.json());
swaggerSetup(app);

// Configure static middleware
// to serve from the production 'dist' folder
app.use(express.static(path.join(__dirname, 'dist')));

// Put API routes here, before the "catch all" route
app.use('/', require('./routes/api/items'));

app.use('/loaderio-b545ed4722925ceeaeb062a1d35fcf05/', require('./loaderio-b545ed4722925ceeaeb062a1d35fcf05'))

// The following "catch all" route (note the *) is necessary
// to return the index.html on all non-AJAX requests
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log(`Express app running on port ${port}`)
});