![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)

# Gestión de Productos - API REST

Aplicación Node.js con Express y PostgreSQL para gestionar productos de una tienda.

**Autor:** Magdalena Inalaf

**Contacto:**
- GitHub: https://github.com/MagdaIG
- LinkedIn: https://www.linkedin.com/in/minalaf/
- Página web: https://inalaf.ca/
- Email: magda.inalaf@gmail.com

## Características

- Consultas parametrizadas para prevenir SQL Injection
- Validación de parámetros
- Uso de async/await para operaciones asíncronas
- Pool de conexiones de PostgreSQL
- CRUD completo de productos

## Requisitos Previos

- Node.js instalado
- PostgreSQL instalado y corriendo
- Acceso a una base de datos PostgreSQL con permisos para crear tablas

## Instalación y Configuración

### Paso 1: Instalar dependencias

Navega a la carpeta del proyecto e instala las dependencias:

```bash
cd gestion-productos
npm install
```

### Paso 2: Configurar variables de entorno

Edita el archivo `.env` con tus credenciales de PostgreSQL. Asegúrate de reemplazar `tu_contraseña` con tu contraseña real:

```
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tienda_db
```

### Paso 3: Crear la base de datos

Conéctate a PostgreSQL como superusuario y crea la base de datos:

```bash
psql -U postgres
```

Dentro de psql, ejecuta:

```sql
CREATE DATABASE tienda_db;
\q
```

### Paso 4: Crear la tabla y datos iniciales

Ejecuta el script SQL para crear la tabla y agregar datos de prueba:

```bash
psql -U postgres -d tienda_db -f database.sql
```

O si prefieres hacerlo manualmente, conecta a la base de datos y ejecuta:

```bash
psql -U postgres -d tienda_db
```

Luego copia y pega el contenido del archivo `database.sql` o ejecuta:

```sql
\i database.sql
```

## Uso

### Iniciar el servidor

Ejecuta el siguiente comando para iniciar el servidor:

```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

### Verificar que funciona

Abre tu navegador o usa curl para probar el endpoint raíz:

```bash
curl http://localhost:3000
```

O visita en tu navegador: `http://localhost:3000`

Deberías ver un JSON con información sobre los endpoints disponibles.

## Endpoints

### GET /api/productos

Obtiene todos los productos registrados en la base de datos.

Ejemplo:
```bash
curl http://localhost:3000/api/productos
```

### GET /api/productos/:id

Obtiene un producto específico por su ID.

Ejemplo:
```bash
curl http://localhost:3000/api/productos/1
```

### GET /api/productos/categoria/:categoria

Obtiene todos los productos de una categoría específica.

Ejemplo:
```bash
curl http://localhost:3000/api/productos/categoria/Electrónica
```

### POST /api/productos

Crea un nuevo producto. Requiere enviar un JSON con los datos del producto.

Ejemplo:
```bash
curl -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Producto ejemplo",
    "precio": 99.99,
    "categoria": "Electrónica",
    "stock": 10
  }'
```

Campos requeridos:
- nombre: texto obligatorio
- precio: número decimal obligatorio (mayor o igual a 0)

Campos opcionales:
- categoria: texto
- stock: número entero (mayor o igual a 0)

### PUT /api/productos/:id

Actualiza un producto existente. Puedes enviar solo los campos que deseas actualizar.

Ejemplo:
```bash
curl -X PUT http://localhost:3000/api/productos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Producto actualizado",
    "precio": 129.99,
    "stock": 20
  }'
```

### DELETE /api/productos/:id

Elimina un producto por su ID.

Ejemplo:
```bash
curl -X DELETE http://localhost:3000/api/productos/1
```

## Estructura del Proyecto

```
gestion-productos/
├── db/
│   └── pool.js          # Configuración del pool de conexiones PostgreSQL
├── routes/
│   └── productos.js     # Rutas para gestionar productos (CRUD)
├── app.js               # Aplicación principal Express
├── database.sql         # Script SQL para crear la tabla y datos iniciales
├── .env                 # Variables de entorno (no subir a repositorio)
├── .gitignore          # Archivos a ignorar en Git
├── package.json         # Dependencias y scripts del proyecto
└── README.md           # Este archivo
```

## Solución de Problemas

### Error de conexión a la base de datos

Verifica que:
1. PostgreSQL esté corriendo
2. Las credenciales en `.env` sean correctas
3. La base de datos `tienda_db` exista
4. El usuario tenga permisos para acceder a la base de datos

### Error "relation productos does not exist"

Asegúrate de haber ejecutado el script `database.sql` para crear la tabla.

### Puerto 3000 ya está en uso

Cambia el puerto en `app.js` o en las variables de entorno:

```javascript
const PORT = process.env.PORT || 3001;
```

## Seguridad

- Todas las consultas SQL utilizan parámetros para prevenir SQL Injection
- Validación de todos los parámetros de entrada antes de ejecutar consultas
- Manejo de errores apropiado en todas las rutas
- Variables sensibles (contraseñas) se almacenan en `.env` que no debe subirse al repositorio

## Tecnologías Utilizadas

- Node.js
- Express.js
- PostgreSQL (con el paquete pg)
- dotenv para gestión de variables de entorno
