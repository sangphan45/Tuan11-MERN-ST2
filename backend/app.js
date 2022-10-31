const express = require('express');
const app = express();
const errorMiddleware = require('./middlewares/errors');
app.use(express.json());
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const dotenv = require('dotenv');
const { connectDatabase } = require('./config/connectDatabase');
const cookieParser = require('cookie-parser');
dotenv.config({ path: 'backend/config/config.env' });
const PORT = process.env.PORT || 4000;
// custom option swagger
options = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Library API',
      version: '1.0.0',
      description: 'A simple Express Library API',
    },
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'cookies',
        },
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: [`${__dirname}/routes/*.js`],
};

// config swagger
const spec = swaggerJsDoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(spec));
app.use(cookieParser());
// connecting database
connectDatabase();
// Import all routes
const products = require('./routes/product');
const auth = require('./routes/auth');

app.use('/api/v1', products);
app.use('/api/v1', auth);

// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app;
