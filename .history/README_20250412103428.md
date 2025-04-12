# Inventory Management System Backend

A Node.js backend application built with TypeScript, Express, MongoDB, and Mongoose.

## Features

- TypeScript for type safety
- Express.js for the web server
- MongoDB with Mongoose for database operations
- Modular architecture
- RESTful API endpoints
- Error handling middleware
- Environment variable configuration
- CORS enabled
- Security headers with Helmet
- Request logging with Morgan

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/inventory
   NODE_ENV=development
   ```

## Running the Application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm run build
npm start
```

## API Endpoints

### Products

- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get a single product
- POST `/api/products` - Create a new product
- PUT `/api/products/:id` - Update a product
- DELETE `/api/products/:id` - Delete a product

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── models/         # Mongoose models
├── routes/         # Express routes
├── services/       # Business logic
├── utils/          # Utility functions
├── middleware/     # Custom middleware
└── index.ts        # Application entry point
```

## Error Handling

The application includes a global error handling middleware that catches and processes errors in a consistent way.

## Security

- CORS enabled
- Helmet for security headers
- Environment variables for sensitive data
- Input validation
- Error handling
