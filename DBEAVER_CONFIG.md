# Configuración DBeaver para MarketSoft

## Opción 1: SQLite (Recomendado para pruebas)

1. Abrir DBeaver
2. Archivo → Nuevo → Conexión de Base de Datos
3. Seleccionar SQLite → Siguiente
4. En "Archivo de la base de datos":
   - Navegar a: C:\Users\adels\OneDrive\Escritorio\MarketSoft\database.sqlite
5. Click en "Probar Conexión"
6. Click en "Finalizar"

## Opción 2: PostgreSQL (Para producción)

### 1. Instalar PostgreSQL
- Descargar desde: https://www.postgresql.org/download/windows/
- Instalar con contraseña: postgres
- Puerto: 5432

### 2. Crear base de datos
```sql
-- Conectar a PostgreSQL por primera vez
-- Abrir pgAdmin o DBeaver y ejecutar:

CREATE DATABASE marketsoft;
CREATE USER marketsoft_user WITH PASSWORD 'marketsoft_password';
GRANT ALL PRIVILEGES ON DATABASE marketsoft TO marketsoft_user;
```

### 3. Configurar conexión en DBeaver
1. Archivo → Nuevo → Conexión de Base de Datos
2. Seleccionar PostgreSQL → Siguiente
3. Configurar:
   - Host: localhost
   - Puerto: 5432
   - Base de datos: marketsoft
   - Usuario: postgres (o marketsoft_user)
   - Contraseña: postgres (o marketsoft_password)
4. Click en "Probar Conexión"
5. Click en "Finalizar"

### 4. Actualizar .env para PostgreSQL
```
DB_NAME=marketsoft
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
PORT=3001
```

## Verificar tablas en DBeaver

Una vez conectado, verás estas tablas:

- providers (proveedores)
- users (usuarios)
- products (productos)
- sales (ventas)
- sale_details (detalles de venta)

## Consultas SQL útiles

```sql
-- Ver todos los proveedores
SELECT * FROM providers;

-- Ver productos con proveedores
SELECT p.*, pr.name as provider_name 
FROM products p 
JOIN providers pr ON p.providerId = pr.id;

-- Ver usuarios
SELECT * FROM users;

-- Ver ventas con detalles
SELECT s.*, u.name as user_name
FROM sales s
JOIN users u ON s.userId = u.id;
```
