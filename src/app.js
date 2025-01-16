const express = require('express');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');
const apiLimiter = require('./middleware/rateLimiter');
const setupSwagger = require('./swagger');

const envFile = process.env.NODE_ENV === 'development' ? '.env.local' : '.env';
require('dotenv').config({ path: envFile });

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());

// Setup Swagger
setupSwagger(app);

// Rate limiter middleware
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
