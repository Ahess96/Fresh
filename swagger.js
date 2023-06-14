const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Fresh API Documentation',
      version: '1.0.0',
      description: 'API documentation for Fresh',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Update with your server URL
      },
    ],
  },
  apis: ['./routes/api/items.js'], // Update with your API routes path
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
