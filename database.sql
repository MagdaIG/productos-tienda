-- Crear la base de datos (ejecutar como superusuario)
-- CREATE DATABASE tienda_db;

-- Conectar a la base de datos tienda_db
-- \c tienda_db

-- Crear la tabla productos
CREATE TABLE productos (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  precio DECIMAL NOT NULL,
  categoria TEXT,
  stock INT
);

-- Insertar algunos productos iniciales para pruebas
INSERT INTO productos (nombre, precio, categoria, stock) VALUES
('Laptop HP', 899.99, 'Electrónica', 15),
('Mouse Logitech', 25.50, 'Accesorios', 50),
('Teclado Mecánico', 89.99, 'Accesorios', 30),
('Monitor 27"', 349.99, 'Electrónica', 20),
('Auriculares Bluetooth', 79.99, 'Accesorios', 40),
('Smartphone Samsung', 699.99, 'Electrónica', 25),
('Tablet iPad', 499.99, 'Electrónica', 12),
('Webcam HD', 59.99, 'Accesorios', 35);

