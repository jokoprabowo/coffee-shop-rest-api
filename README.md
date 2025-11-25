# ☕ Coffee Shop REST API

The Coffee Shop REST API is a backend service designed to manage a coffee shop’s operations, built with **Express.js**, **TypeScript**, **PostgreSQL**, **Redis**, and **RabbitMQ**. It provides endpoints to handle customers, menu items, orders, carts, and authentication, enabling smooth integration with frontend or mobile applications, and fully containerized using **Docker**.

This project is structured as a **monorepo** and managed using **Turborepo** for optimized builds, caching, and workspace organization.

---

## 🧩 Monorepo Architecture (Turborepo)

This repository uses Turborepo to manage multiple backend-related packages and services in a single monorepo.
Some benefits include:

* **Shared code** (types, utilities, configs) across services

* **Remote & local caching** for faster build and development

* **Pipeline orchestration** for linting, building, testing

* **Workspace organization** for multi-service backend structure

---

## 🔑 Key Features

* **User Authentication & Authorization** (JWT & Refresh Token support)
* **Menu Management**: Add, update, delete, and fetch coffee
* **Cart System**: Manage user carts (add, update quantity, remove items)
* **Order Management**: Place and track customer orders based on their carts
* **Database Migrations & Seeding** for development and production environments
* **Dockerized Setup** for easy deployment and scalability
* **Message Queue**: RabbitMQ
* **Caching**: Redis

---

## 🛠 Tech Stack

* **Backend**: Node.js, Express.js, TypeScript
* **Database**: PostgreSQL
* **Authentication**: JWT-based system with refresh token
* **Testing**: Jest, Supertest
* **Message Queue**: RabbitMQ
* **Caching**: Redis,
* **Monorepo management**: Turborepo
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

This project uses two environment files to separate local development configuration from Docker production configuration.

### 📌 Environment Files
| File                   | Purpose                                                               |
| ---------------------- | --------------------------------------------------------------------- |
| **`.env.development`** | Used when running the project **locally** (without Docker).           |
| **`.env.production`**  | Used when running the project **inside Docker** via `docker-compose`. |
You must create both files in the project root


### 🧪 `.env.development` (Local Development)

Use local service addresses when you run the backend without Docker:

```env
PORT=3000

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/dbname

# Authentication
JWT_ACCESS_SECRET=your_secret_key
ACCESS_TOKEN_EXPIRY=30m
WHITELIST_ORIGINS=http://localhost:3000
WHITELIST_ADMIN_EMAILS=jokoprabowo4550@gmail.com

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

# RabbitMQ
RABBITMQ_URL=amqp://localhost:5672
```

---

### 🏭 `.env.production` (Docker Environment)

These values are used automatically by docker-compose, where services communicate using Docker internal hostnames:

```env
PORT=3000

# Database
DATABASE_URL=postgresql://postgres:password@db:5432/coffeeshop

# Authentication
JWT_ACCESS_SECRET=your_secret_key
ACCESS_TOKEN_EXPIRY=30m
WHITELIST_ORIGINS=http://localhost:3000
WHITELIST_ADMIN_EMAILS=jokoprabowo4550@gmail.com

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

# RabbitMQ
RABBITMQ_URL=amqp://rabbitmq:5672
```

---

### 4. Run locally (without Docker)
---
**⚠️ Important Warning**
To run the project locally, several external services must be running on your machine:

1. PostgreSQL (database)

2. Redis (cache / token store)

3. RabbitMQ (message broker)

If any of these are not running, the API will fail to start.

---
**Build and start development mode**

```bash
npm run build
npm run dev
```

Server will be available at: `http://localhost:3000`

---

## 🐳 Running with Docker

**Build and start services:**

```bash
docker-compose up --build
```

Runs the following containers:

* API (Express + TypeScript)
* Consumer
* Scheduler
* PostgreSQL
* Redis
* RabbitMQ

**To stop:**

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

## 📄 License

This project is licensed under the MIT License.