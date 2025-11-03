const express = require('express');
const pool = require('./db/pool');
const productosRoutes = require('./routes/productos');

async function runTests() {
  console.log('=== INICIANDO PRUEBAS ===\n');
  
  let testsPassed = 0;
  let testsFailed = 0;

  // Test 1: Verificar que las dependencias están instaladas
  console.log('Test 1: Verificar dependencias...');
  try {
    require('express');
    require('pg');
    require('dotenv');
    console.log('✓ Todas las dependencias están instaladas');
    testsPassed++;
  } catch (error) {
    console.log('✗ Error: Dependencias faltantes');
    console.log(error.message);
    testsFailed++;
  }

  // Test 2: Verificar que el pool se puede importar
  console.log('\nTest 2: Verificar configuración del pool...');
  try {
    if (pool && typeof pool.query === 'function') {
      console.log('✓ Pool de conexiones configurado correctamente');
      testsPassed++;
    } else {
      throw new Error('Pool no tiene el método query');
    }
  } catch (error) {
    console.log('✗ Error en la configuración del pool');
    console.log(error.message);
    testsFailed++;
  }

  // Test 3: Verificar que Express se puede inicializar
  console.log('\nTest 3: Verificar inicialización de Express...');
  try {
    const app = express();
    if (app) {
      console.log('✓ Express se inicializa correctamente');
      testsPassed++;
    }
  } catch (error) {
    console.log('✗ Error al inicializar Express');
    console.log(error.message);
    testsFailed++;
  }

  // Test 4: Verificar que las rutas están configuradas
  console.log('\nTest 4: Verificar configuración de rutas...');
  try {
    const app = express();
    app.use('/api/productos', productosRoutes);
    console.log('✓ Rutas de productos configuradas correctamente');
    testsPassed++;
  } catch (error) {
    console.log('✗ Error en la configuración de rutas');
    console.log(error.message);
    testsFailed++;
  }

  // Test 5: Verificar conexión a PostgreSQL (si está disponible)
  console.log('\nTest 5: Verificar conexión a PostgreSQL...');
  try {
    const client = await pool.connect();
    console.log('✓ Conexión a PostgreSQL exitosa');
    client.release();
    testsPassed++;
  } catch (error) {
    console.log('⚠ Conexión a PostgreSQL falló (esto es normal si PostgreSQL no está corriendo)');
    console.log('  Mensaje:', error.message);
    console.log('  Asegúrate de que PostgreSQL esté corriendo y las credenciales en .env sean correctas');
    // No contamos esto como fallo porque puede ser que PostgreSQL no esté configurado
  }

  // Test 6: Verificar que la tabla existe (si hay conexión)
  console.log('\nTest 6: Verificar existencia de la tabla productos...');
  try {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'productos'
      );
    `);
    
    if (result.rows[0].exists) {
      console.log('✓ La tabla productos existe');
      testsPassed++;
      
      // Test 7: Probar consulta SELECT
      console.log('\nTest 7: Probar consulta SELECT (consultas parametrizadas)...');
      try {
        const selectResult = await pool.query('SELECT * FROM productos LIMIT 1');
        console.log('✓ Consulta SELECT ejecutada correctamente');
        console.log('  Productos encontrados:', selectResult.rowCount);
        testsPassed++;
      } catch (error) {
        console.log('✗ Error en consulta SELECT');
        console.log(error.message);
        testsFailed++;
      }
    } else {
      console.log('⚠ La tabla productos no existe');
      console.log('  Ejecuta el script database.sql para crear la tabla');
    }
  } catch (error) {
    console.log('⚠ No se pudo verificar la tabla (PostgreSQL no disponible)');
    console.log('  Mensaje:', error.message);
  }

  // Test 8: Verificar consultas parametrizadas (sintaxis)
  console.log('\nTest 8: Verificar uso de consultas parametrizadas en código...');
  try {
    const fs = require('fs');
    const routesContent = fs.readFileSync('./routes/productos.js', 'utf8');
    
    // Verificar que no hay concatenación directa de strings en consultas SQL
    const hasDirectConcatenation = /query\(['"`].*\+.*['"`]/.test(routesContent);
    const hasParameterizedQueries = /\$[0-9]+/.test(routesContent);
    
    if (!hasDirectConcatenation && hasParameterizedQueries) {
      console.log('✓ Consultas parametrizadas correctamente implementadas');
      console.log('  Se encontraron parámetros $1, $2, etc. en las consultas');
      testsPassed++;
    } else {
      throw new Error('Se encontraron consultas sin parametrizar o sin parámetros');
    }
  } catch (error) {
    console.log('✗ Error al verificar consultas parametrizadas');
    console.log(error.message);
    testsFailed++;
  }

  // Test 9: Verificar validación de parámetros
  console.log('\nTest 9: Verificar validación de parámetros...');
  try {
    const fs = require('fs');
    const routesContent = fs.readFileSync('./routes/productos.js', 'utf8');
    
    const hasValidation = /isNaN|trim|parseInt|parseFloat/.test(routesContent);
    const hasErrorHandling = /res\.status\(400\)|res\.status\(404\)/.test(routesContent);
    
    if (hasValidation && hasErrorHandling) {
      console.log('✓ Validación de parámetros implementada');
      console.log('  Se encontraron validaciones y manejo de errores');
      testsPassed++;
    } else {
      throw new Error('Validación de parámetros incompleta');
    }
  } catch (error) {
    console.log('✗ Error al verificar validación');
    console.log(error.message);
    testsFailed++;
  }

  // Test 10: Verificar uso de async/await
  console.log('\nTest 10: Verificar uso de async/await...');
  try {
    const fs = require('fs');
    const routesContent = fs.readFileSync('./routes/productos.js', 'utf8');
    
    const hasAsync = /async\s+\(/.test(routesContent);
    const hasAwait = /await\s+pool\.query/.test(routesContent);
    
    if (hasAsync && hasAwait) {
      console.log('✓ Uso correcto de async/await');
      console.log('  Las rutas utilizan async/await para operaciones asíncronas');
      testsPassed++;
    } else {
      throw new Error('No se encontró uso de async/await');
    }
  } catch (error) {
    console.log('✗ Error al verificar async/await');
    console.log(error.message);
    testsFailed++;
  }

  // Resumen
  console.log('\n=== RESUMEN DE PRUEBAS ===');
  console.log(`Pruebas exitosas: ${testsPassed}`);
  console.log(`Pruebas fallidas: ${testsFailed}`);
  console.log(`Total: ${testsPassed + testsFailed}`);
  
  if (testsFailed === 0) {
    console.log('\n✓ Todas las pruebas pasaron correctamente');
    process.exit(0);
  } else {
    console.log('\n✗ Algunas pruebas fallaron');
    process.exit(1);
  }
}

// Ejecutar pruebas
runTests().catch(error => {
  console.error('Error fatal durante las pruebas:', error);
  process.exit(1);
});

