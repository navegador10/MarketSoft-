require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MarketSoft API',
      version: '1.0.0',
      description: 'Backend API for supermarket management system',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Test routes without database
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'MarketSoft API is working!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Mock data for testing
const mockProviders = [
  { id: 1, name: 'Distribuidora Central', phone: '1234567890', email: 'contacto@distcentral.com', city: 'Ciudad de México' },
  { id: 2, name: 'Proveedora Nacional', phone: '0987654321', email: 'info@provnacional.com', city: 'Guadalajara' }
];

const mockProducts = [
  { id: 1, name: 'Leche Entera', description: 'Leche entera 1L', price: 25.50, stock: 100, providerId: 1 },
  { id: 2, name: 'Pan Integral', description: 'Pan integral 500g', price: 15.75, stock: 50, providerId: 2 }
];

// Mock API endpoints
app.get('/api/providers', (req, res) => {
  res.json(mockProviders);
});

app.get('/api/products', (req, res) => {
  res.json(mockProducts);
});

app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'Admin User', email: 'admin@marketsoft.com', role: 'admin' },
    { id: 2, name: 'Employee User', email: 'employee@marketsoft.com', role: 'employee' }
  ]);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MarketSoft Test Server is running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test Endpoint: http://localhost:${PORT}/api/test`);
  console.log(`📦 Mock Providers: http://localhost:${PORT}/api/providers`);
  console.log(`🛒 Mock Products: http://localhost:${PORT}/api/products`);
});

module.exports = app;
