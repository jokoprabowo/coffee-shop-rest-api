# ☕ Coffee Shop REST API

The Coffee Shop REST API is a backend service designed to manage a coffee shop’s operations, built with **Express.js**, **TypeScript**, **PostgreSQL**, and **Docker**. It provides endpoints to handle customers, menu items, orders, carts, and authentication, enabling smooth integration with frontend or mobile applications.

---

## 🔑 Key Features

* **User Authentication & Authorization** (JWT & Refresh Token support)
* **Menu Management**: Add, update, delete, and fetch coffee
* **Cart System**: Manage user carts (add, update quantity, remove items)
* **Order Management**: Place and track customer orders based on their carts
* **Database Migrations & Seeding** for development and production environments
* **Dockerized Setup** for easy deployment and scalability

---

## 🛠 Tech Stack

* **Backend**: Node.js, Express.js, TypeScript
* **Database**: PostgreSQL
* **Authentication**: JWT-based system with refresh token
* **Testing**: Jest, Supertest
* **Containerization**: Docker, Docker Compose

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/jokoprabowo/coffee-shop-rest-api
cd coffee-shop-rest-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Copy `.env.example` to `.env` and configure it:

```env
NODE_ENV=development
PORT=3000
DB_USER=username
DB_PASSWORD=password
DB_NAME=dbname
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_ACCESS_SECRET=your-secret
ACCESS_TOKEN_EXPIRY=30m
WHITELIST_ORIGINS=http://localhost:3000
WHITELIST_ADMIN_EMAILS=youradminemail@email.com
```

### 4. Run locally (without Docker)

```bash
npm run start:dev
```

Server will be available at: `http://localhost:3000`

---

## 🐳 Running with Docker

Build and start services:

```bash
docker-compose up --build
```

* API: `http://localhost:3000`
* Database: `localhost:5432`

To stop:

```bash
docker-compose down
```

---

## 📖 API Documentation

* Swagger UI available at: `http://localhost:3000/api-docs`

Example request:

```http
GET /api/v1/user/profile
Authorization: Bearer <token>
```

---

## 🧪 Testing

Run all tests:

```bash
npm run test
```

Run a specific test file:

```bash
npm run test path
```

example:

```bash
npm run test integration/auth/login.test.ts
```

---

## 🚀 Deployment

Production build:

```bash
npm run build
npm start
```

Or with Docker:

```bash
docker-compose up --build -d
```