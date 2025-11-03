const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// GET - Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    // Consulta sencilla parametrizada
    const result = await pool.query('SELECT * FROM productos ORDER BY id ASC');
    res.json({
      success: true,
      data: result.rows,
      count: result.rowCount
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos',
      error: error.message
    });
  }
});

// GET - Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validación de parámetros
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }

    // Consulta parametrizada para evitar SQL Injection
    const result = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener producto',
      error: error.message
    });
  }
});

// GET - Obtener productos por categoría
router.get('/categoria/:categoria', async (req, res) => {
  try {
    const { categoria } = req.params;
    
    // Validación de parámetros
    if (!categoria || categoria.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Categoría inválida'
      });
    }

    // Consulta parametrizada
    const result = await pool.query(
      'SELECT * FROM productos WHERE categoria = $1 ORDER BY nombre ASC',
      [categoria]
    );

    res.json({
      success: true,
      data: result.rows,
      count: result.rowCount
    });
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos por categoría',
      error: error.message
    });
  }
});

// POST - Crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const { nombre, precio, categoria, stock } = req.body;

    // Validación de parámetros
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El nombre es requerido'
      });
    }

    if (!precio || isNaN(parseFloat(precio)) || parseFloat(precio) < 0) {
      return res.status(400).json({
        success: false,
        message: 'El precio debe ser un número válido mayor o igual a 0'
      });
    }

    if (stock !== undefined && (isNaN(parseInt(stock)) || parseInt(stock) < 0)) {
      return res.status(400).json({
        success: false,
        message: 'El stock debe ser un número entero válido mayor o igual a 0'
      });
    }

    // Consulta parametrizada INSERT para evitar SQL Injection
    const result = await pool.query(
      'INSERT INTO productos (nombre, precio, categoria, stock) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, precio, categoria || null, stock !== undefined ? stock : null]
    );

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear producto',
      error: error.message
    });
  }
});

// PUT - Actualizar un producto
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, categoria, stock } = req.body;

    // Validación de ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }

    // Validación de parámetros
    if (precio !== undefined && (isNaN(parseFloat(precio)) || parseFloat(precio) < 0)) {
      return res.status(400).json({
        success: false,
        message: 'El precio debe ser un número válido mayor o igual a 0'
      });
    }

    if (stock !== undefined && (isNaN(parseInt(stock)) || parseInt(stock) < 0)) {
      return res.status(400).json({
        success: false,
        message: 'El stock debe ser un número entero válido mayor o igual a 0'
      });
    }

    // Construir consulta UPDATE dinámica solo con los campos proporcionados
    const campos = [];
    const valores = [];
    let paramIndex = 1;

    if (nombre !== undefined) {
      campos.push(`nombre = $${paramIndex++}`);
      valores.push(nombre);
    }
    if (precio !== undefined) {
      campos.push(`precio = $${paramIndex++}`);
      valores.push(precio);
    }
    if (categoria !== undefined) {
      campos.push(`categoria = $${paramIndex++}`);
      valores.push(categoria);
    }
    if (stock !== undefined) {
      campos.push(`stock = $${paramIndex++}`);
      valores.push(stock);
    }

    if (campos.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar al menos un campo para actualizar'
      });
    }

    valores.push(id);
    const query = `UPDATE productos SET ${campos.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

    // Consulta parametrizada UPDATE
    const result = await pool.query(query, valores);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar producto',
      error: error.message
    });
  }
});

// DELETE - Eliminar un producto
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validación de ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }

    // Consulta parametrizada DELETE para evitar SQL Injection
    const result = await pool.query('DELETE FROM productos WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar producto',
      error: error.message
    });
  }
});

module.exports = router;

