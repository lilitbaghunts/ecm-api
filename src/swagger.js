const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'ECM API',
    version: '1.0.0',
    description: 'A simple API for e-commerce management'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      discription: 'Local server'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};

// Options for swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ['./src/docs/*.js', './src/routes/*.js'] // Path to your API route files
};

// Initialize Swagger-jsdoc
const swaggerDocs = swaggerJSDoc(options);

// Set up Swagger UI
const setupSwagger = (app) => {
  // Serve Swagger UI at /api-docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
module.exports = setupSwagger;
