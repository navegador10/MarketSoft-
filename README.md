# MarketSoft Backend API

Backend API for supermarket management system built with Node.js, Express, PostgreSQL, and Sequelize ORM.

## 🎯 Project Objective

Design and implement a REST API for a supermarket management system using MVC architecture, applying CRUD operations over multiple related entities with proper data validation and documentation.

## 🏗️ Architecture

- **Language**: JavaScript (Node.js)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Architecture**: MVC (Model-View-Controller)
- **Documentation**: Swagger/OpenAPI 3.0

## 📋 Team Members

- **[Student 1 Name]** - Project Lead & Database Design
- **[Student 2 Name]** - API Development & Testing
- **[Student 3 Name]** - Documentation & Validation
- **[Student 4 Name]** - Frontend Integration & Deployment

### Note: Replace with actual team member names and responsibilities

## 🗄️ Database Entities

### Proveedores (Providers)

- `id` (Primary Key)
- `name` - Nombre del proveedor
- `phone` - Teléfono del proveedor
- `email` - Email del proveedor
- `city` - Ciudad del proveedor

### Usuarios (Users)

- `id` (Primary Key)
- `name` - Nombre del usuario
- `email` - Email único del usuario
- `role` - Rol (admin, employee, customer)

### Productos (Products)

- `id` (Primary Key)
- `name` - Nombre del producto
- `description` - Descripción del producto
- `price` - Precio (mayor a 0)
- `stock` - Stock disponible (no negativo)
- `providerId` - Foreign Key a Proveedores

### Ventas (Sales)

- `id` (Primary Key)
- `userId` - Foreign Key a Usuarios
- `date` - Fecha de la venta
- `total` - Total calculado automáticamente

### DetalleVenta (Sale Details)

- `id` (Primary Key)
- `saleId` - Foreign Key a Ventas
- `productId` - Foreign Key a Productos
- `quantity` - Cantidad del producto
- `price` - Precio del producto

## 🔗 Entity Relationships

- Proveedor → Productos (One-to-Many)
- Usuario → Ventas (One-to-Many)
- Venta → DetalleVenta (One-to-Many)
- Producto → DetalleVenta (One-to-Many)

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- Git

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/marketsoft-backend.git
   cd marketsoft-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your database configuration:

   - DB_NAME=marketsoft
   - DB_USER=postgres
   - DB_PASSWORD=your_password
   - DB_HOST=localhost
   - DB_PORT=5432
   - PORT=3000

4. **Create PostgreSQL database**

   ```sql
   CREATE DATABASE marketsoft;
   ```

5. **Start the server**

   ```bash
   npm start
   ```

   For development with auto-reload:

   ```bash
   npm run dev
   ```

## 📚 API Documentation

Once the server is running, visit:

- **Swagger UI**: `http://localhost:3000/api-docs`
- **Health Check**: `http://localhost:3000/health`

## 🔌 API Endpoints

### Proveedores (/api/providers)

- `GET /api/providers` - List all providers
- `GET /api/providers/:id` - Get provider by ID
- `POST /api/providers` - Create new provider
- `PUT /api/providers/:id` - Update provider
- `DELETE /api/providers/:id` - Delete provider

### Usuarios (/api/users)

- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Productos (/api/products)

- `GET /api/products` - List all products (with provider info)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Ventas (/api/sales)

- `GET /api/sales` - List all sales (with details)
- `GET /api/sales/:id` - Get sale by ID
- `POST /api/sales` - Create new sale (with stock management)
- `PUT /api/sales/:id` - Update sale
- `DELETE /api/sales/:id` - Delete sale (restores stock)

### DetalleVenta (/api/sale-details)

- `GET /api/sale-details` - List all sale details
- `GET /api/sale-details/:id` - Get sale detail by ID
- `POST /api/sale-details` - Create new sale detail
- `PUT /api/sale-details/:id` - Update sale detail
- `DELETE /api/sale-details/:id` - Delete sale detail

## ✅ Validations

### Productos

- **price**: Must be greater than 0
- **stock**: Cannot be negative
- **providerId**: Must reference an existing provider

### Usuarios

- **email**: Must be unique and valid email format

### Ventas

- **total**: Calculated automatically from sale details
- **stock**: Automatically updated when creating/deleting sales

## 📝 Example Requests

### Create a Provider

```bash
POST /api/providers
Content-Type: application/json
```

```json
{
  "name": "Distribuidora Central",
  "phone": "+1234567890",
  "email": "contacto@distcentral.com",
  "city": "Ciudad de México"
}
```

### Create a Product

```bash
POST /api/products
Content-Type: application/json
```

```json
{
  "name": "Leche Entera",
  "description": "Leche entera 1L",
  "price": 25.50,
  "stock": 100,
  "providerId": 1
}
```

### Create a Sale

```bash
POST /api/sales
Content-Type: application/json
```

```json
{
  "userId": 1,
  "saleDetails": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ]
}
```

## 🧪 Testing

The API includes comprehensive validation and error handling:

- **400 Bad Request**: Invalid data or validation errors
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server errors

## 🗂️ Project Structure

```text
marketsoft-backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/
│   │   ├── providerController.js
│   │   ├── userController.js
│   │   ├── productController.js
│   │   ├── saleController.js
│   │   └── saleDetailController.js
│   ├── models/
│   │   ├── index.js             # Model relationships
│   │   ├── Provider.js
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Sale.js
│   │   └── SaleDetail.js
│   └── routes/
│       ├── index.js             # Main routes
│       ├── providerRoutes.js
│       ├── userRoutes.js
│       ├── productRoutes.js
│       ├── saleRoutes.js
│       └── saleDetailRoutes.js
├── .env.example                 # Environment variables template
├── package.json                 # Dependencies and scripts
├── README.md                    # This file
└── server.js                    # Main application entry point
```

## 🔧 Features Implemented

- ✅ MVC Architecture
- ✅ Complete CRUD operations for all entities
- ✅ Database relationships and associations
- ✅ Data validation (products, users, sales)
- ✅ Automatic stock management
- ✅ Sale total calculation
- ✅ Swagger/OpenAPI documentation
- ✅ Error handling and validation
- ✅ Health check endpoint
- ✅ Graceful shutdown
- ✅ Environment configuration

## 🚀 Deployment

The application is ready for deployment with:

1. **Environment Variables**: Configure database connection
2. **Database**: PostgreSQL database must be created
3. **Dependencies**: Run `npm install`
4. **Start**: Run `npm start`

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For any questions or issues, please contact the development team or create an issue in the repository.

---

**Last Updated**: March 2026
**Version**: 1.0.0
