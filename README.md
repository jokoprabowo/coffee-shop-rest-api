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

## 🚀 Features  

### 🔐 Authentication & Security  
- **JWT Authentication** with Access Token & Refresh Token  
- **Email Verification**  
  - Automatically sends verification email upon user registration  
  - Secure verification using token-based validation  
- **Forgot & Reset Password**  
  - Password reset flow via email  
  - Time-limited reset tokens for enhanced security  
- **Role-based Authorization** (Admin & Customer)  

### ☕ Coffee Shop Core Features  
- **Product Management**  
  - Create, update, delete, and retrieve coffee & menu items  
- **Cart System**  
  - Add products to cart  
  - Update quantity and remove items  
- **Order Management**  
  - Create orders from cart  
  - Track order status (pending, paid, completed)  

### 📧 Email Service  
- **Nodemailer Integration**  
  - Send verification emails  
  - Send password reset emails  
  - Configurable SMTP service (Gmail, Mailtrap, etc.)  

### ⚡ Performance & Scalability  
- **Redis Integration** for caching and token/session handling  
- **RabbitMQ** for asynchronous event handling  
  - Email jobs  
  - Order-related events  

### 🛠️ Developer Experience  
- **Type-safe codebase** with TypeScript  
- **PostgreSQL Transactions** for data consistency  
- **Unit & Integration Testing** using Jest  
- **Docker & Docker Compose** for consistent development and deployment  

---

## 🧰 Tech Stack  
- **Backend Framework**: Express.js + TypeScript  
- **Database**: PostgreSQL  
- **Authentication**: JWT (Access Token & Refresh Token)  
- **Email Service**: Nodemailer  
- **Caching**: Redis  
- **Message Broker**: RabbitMQ  
- **Testing**: Jest & Supertest  
- **Containerization**: Docker & Docker Compose  

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
| File                   | Purpose                                                                |
| ---------------------- | ---------------------------------------------------------------------- |
| **`.env.development`** | Used when running the project **locally** (without Docker).            |
| **`.env.test`**        | Used when running the project **locally** for testing (without Docker).|
| **`.env.production`**  | Used when running the project **inside Docker** via `docker-compose`.  |
You must create both files in the project root


### 🧪 `.env.development` and `.env.test` (Local Development)

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
npm run migrate:up:dev
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
Run migration for testing environment

```bash
npm run migrate:up:test
```

Run all tests in api service:

```bash
npm run test:api
```

Run all tests in consumer service:

```bash
npm run test:consumer
```

---

## 📄 License

This project is licensed under the MIT License.