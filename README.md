# E-Commerce API (ECM API)

This project is a RESTful API for managing an e-commerce platform. It provides services for user authentication, product management, and order processing.

## Technologies Used

- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Web framework for Node.js
- **MongoDB** - NoSQL database for storing data
- **Redis** - In-memory cache for product search results
- **JWT (JSON Web Tokens)** - Used for user authentication and authorization
- **bcryptjs** - Used for hashing passwords
- **Jest** - Testing framework
- **Docker** - Containerization for easy deployment
- **Rate Limiter** - To prevent abuse of API endpoints

## Setup and Installation

### 1. Clone the repository

```bash
git clone https://github.com/lilitbaghunts/ecm-api.git
cd ecm-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a .env file in the root directory and add the variables from the provided env.sample.

### 4. Run the application

```bash
npm start
```

## Docker Setup

If you want to run the application using Docker, follow these steps:

### Build Docker image and Run the application with Docker Compose

```bash
docker compose up --build
```

## Testing

To run tests with Jest:

```bash
npm test
```

## API Endpoints

### Auth

- POST /api/auth/register - Register a new user.
- POST /api/auth/login - Authenticate and get a JWT.

### Products

- GET /api/products/ - List all products. (Cached)
- POST /api/products/ - Create a product. (Admin & Auth required)
- GET /api/products/:id - Get product by ID.
- PUT /api/products/:id - Update a product. (Admin & Auth required)
- DELETE /api/products/:id - Delete a product. (Admin & Auth required)

### Orders

- POST /api/orders/ - Create an order. (Auth required)
- GET /api/orders/ - Get all orders for the user. (Auth required)
- GET /api/orders/:id - Get order by ID. (Auth required)
