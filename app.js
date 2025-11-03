const express = require('express');
require('dotenv').config();
const productosRoutes = require('./routes/productos');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api/productos', productosRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'API de Gestión de Productos',
    endpoints: {
      'GET /api/productos': 'Obtener todos los productos',
      'GET /api/productos/:id': 'Obtener un producto por ID',
      'GET /api/productos/categoria/:categoria': 'Obtener productos por categoría',
      'POST /api/productos': 'Crear un nuevo producto',
      'PUT /api/productos/:id': 'Actualizar un producto',
      'DELETE /api/productos/:id': 'Eliminar un producto'
    }
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: err.message
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;

