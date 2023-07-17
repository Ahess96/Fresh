require('dotenv').config();
const express = require('express');
const compression = require('compression');
const logger = require('morgan');
const path = require('path');
const swaggerSetup = require('./swagger');

// connect to DB
require('./config/database');

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.static('public'));
swaggerSetup(app);

// Implement compression to improve decrease bandwidth and file size
app.use(compression({
  // sets to default compression
  level: -1,
  threshold: 10 * 1000,
  filter: (req, res) => {
    // dont compress if specified not to
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
}))

// Configure static middleware
// to serve from the production 'dist' folder
app.use(express.static(path.join(__dirname, 'dist')));

// Put API routes here, before the "catch all" route
app.use('/', require('./routes/api/items'));

// The following "catch all" route
// to return the index.html on all non-AJAX requests
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log(`Express app running on port ${port}`)
});