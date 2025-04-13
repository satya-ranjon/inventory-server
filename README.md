# Inventory Management API

A robust backend API for inventory management built with Node.js, Express, TypeScript, and MongoDB.

## Live API

The API is deployed and accessible at: [https://in-server-theta.vercel.app/](https://in-server-theta.vercel.app/)

## Features

- **Authentication & Authorization**: Secure JWT-based authentication with role-based access control
- **Item Management**: Create, read, update, and delete inventory items
- **Customer Management**: Customer data handling with contact information
- **Sales Order Management**: Process and track sales orders
- **Low Stock Alerts**: Automatically identify items that need reordering

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod schema validation
- **Error Handling**: Global error handler with custom error classes

## Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- Git

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/inventory-db
   BCRYPT_SALT_ROUNDS=12
   JWT_SECRET=your-jwt-secret-key-here
   JWT_EXPIRES_IN=1d
   JWT_REFRESH_SECRET=your-jwt-refresh-secret-key-here
   JWT_REFRESH_EXPIRES_IN=7d
   ```

## Development

Start the development server with hot-reloading:

```bash
npm run dev
```

## Production Build

Build the project:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## API Documentation

### Authentication

| Endpoint                  | Method | Description          | Access |
| ------------------------- | ------ | -------------------- | ------ |
| `/api/auth/register`      | POST   | Register a new user  | Public |
| `/api/auth/login`         | POST   | Login and get tokens | Public |
| `/api/auth/refresh-token` | POST   | Refresh access token | Public |

### Items

| Endpoint               | Method | Description         | Access         |
| ---------------------- | ------ | ------------------- | -------------- |
| `/api/items`           | GET    | Get all items       | Public         |
| `/api/items/:id`       | GET    | Get single item     | Public         |
| `/api/items/low-stock` | GET    | Get low stock items | Public         |
| `/api/items/create`    | POST   | Create new item     | Admin, Manager |
| `/api/items/:id`       | PATCH  | Update item         | Admin, Manager |
| `/api/items/:id`       | DELETE | Delete item         | Admin          |

### Customers

| Endpoint                | Method | Description         | Access         |
| ----------------------- | ------ | ------------------- | -------------- |
| `/api/customers`        | GET    | Get all customers   | Public         |
| `/api/customers/:id`    | GET    | Get single customer | Public         |
| `/api/customers/create` | POST   | Create new customer | Admin, Manager |
| `/api/customers/:id`    | PATCH  | Update customer     | Admin, Manager |
| `/api/customers/:id`    | DELETE | Delete customer     | Admin          |

### Sales Orders

| Endpoint                   | Method | Description            | Access                   |
| -------------------------- | ------ | ---------------------- | ------------------------ |
| `/api/sales-orders`        | GET    | Get all sales orders   | Public                   |
| `/api/sales-orders/:id`    | GET    | Get single sales order | Public                   |
| `/api/sales-orders/create` | POST   | Create new sales order | Admin, Manager, Employee |
| `/api/sales-orders/:id`    | PATCH  | Update sales order     | Admin, Manager           |
| `/api/sales-orders/:id`    | DELETE | Delete sales order     | Admin                    |

## Data Models

### User

- Name
- Email
- Password (hashed)
- Role (admin, manager, employee)
- isActive
- isVerified

### Item

- Type (Goods or Service)
- Name
- SKU
- Unit
- isReturnable
- Dimensions (optional)
- Weight (optional)
- Manufacturer (optional)
- Brand (optional)
- Pricing information
- Inventory tracking

### Customer

- Name
- Email
- Phone
- Address
- Contact Persons

### Sales Order

- Customer reference
- Order date
- Status
- Items
- Total amount
- Shipping details

## Error Handling

The API uses a global error handler that standardizes error responses across the application. All errors return:

- HTTP status code
- Error message
- Error details (when applicable)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
