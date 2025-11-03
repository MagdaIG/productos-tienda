#!/bin/bash

# Script para probar los endpoints de la API
# Asegúrate de que el servidor esté corriendo (npm start)

BASE_URL="http://localhost:3000"
API_URL="${BASE_URL}/api/productos"

echo "=== PRUEBAS DE API ===\n"

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para hacer pruebas
test_endpoint() {
    local method=$1
    local url=$2
    local data=$3
    local description=$4
    
    echo "Probando: $description"
    echo "  $method $url"
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$url" \
            -H "Content-Type: application/json" \
            -d "$data")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$url")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "  ${GREEN}✓ Éxito (HTTP $http_code)${NC}"
        echo "  Respuesta: $body" | head -c 200
        echo ""
    else
        echo -e "  ${RED}✗ Error (HTTP $http_code)${NC}"
        echo "  Respuesta: $body"
    fi
    echo ""
}

# Verificar que el servidor esté corriendo
echo "Verificando que el servidor esté corriendo..."
if curl -s "$BASE_URL" > /dev/null; then
    echo -e "${GREEN}✓ Servidor está corriendo${NC}\n"
else
    echo -e "${RED}✗ El servidor no está corriendo${NC}"
    echo "  Ejecuta: npm start"
    exit 1
fi

# Test 1: GET raíz
test_endpoint "GET" "$BASE_URL" "" "GET / - Información de la API"

# Test 2: GET todos los productos
test_endpoint "GET" "$API_URL" "" "GET /api/productos - Obtener todos los productos"

# Test 3: GET producto por ID (asumiendo que existe el ID 1)
test_endpoint "GET" "$API_URL/1" "" "GET /api/productos/1 - Obtener producto por ID"

# Test 4: GET productos por categoría
test_endpoint "GET" "$API_URL/categoria/Electrónica" "" "GET /api/productos/categoria/Electrónica - Productos por categoría"

# Test 5: POST crear producto
test_endpoint "POST" "$API_URL" '{
  "nombre": "Producto Prueba",
  "precio": 49.99,
  "categoria": "Pruebas",
  "stock": 100
}' "POST /api/productos - Crear nuevo producto"

# Test 6: PUT actualizar producto (asumiendo ID 1)
test_endpoint "PUT" "$API_URL/1" '{
  "precio": 59.99,
  "stock": 50
}' "PUT /api/productos/1 - Actualizar producto"

# Test 7: DELETE producto (comentar si no quieres eliminar datos)
# test_endpoint "DELETE" "$API_URL/1" "" "DELETE /api/productos/1 - Eliminar producto"

# Test 8: Validación - POST con datos inválidos
echo "Probando: POST con datos inválidos (validación)"
response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d '{"precio": -100}')
http_code=$(echo "$response" | tail -n1)
if [ "$http_code" -eq 400 ]; then
    echo -e "  ${GREEN}✓ Validación funciona correctamente (HTTP 400)${NC}\n"
else
    echo -e "  ${YELLOW}⚠ Validación puede necesitar ajustes (HTTP $http_code)${NC}\n"
fi

# Test 9: SQL Injection attempt - GET con ID malicioso
echo "Probando: Protección contra SQL Injection"
response=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/1' OR '1'='1")
http_code=$(echo "$response" | tail -n1)
if [ "$http_code" -eq 400 ] || [ "$http_code" -eq 404 ]; then
    echo -e "  ${GREEN}✓ Protección contra SQL Injection activa${NC}\n"
else
    echo -e "  ${YELLOW}⚠ Revisar protección (HTTP $http_code)${NC}\n"
fi

echo "=== PRUEBAS COMPLETADAS ==="

