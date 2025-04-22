<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# NestJS Starter Template

A robust and scalable starter project built with [NestJS](https://nestjs.com/), ready to kickstart modern backend applications following clean architecture principles and best practices.

🙌 In just a few commands, you're ready to develop with a production-grade NestJS backend.

## ✨ Overview

This repository provides a solid foundation to build RESTful APIs with **NestJS**, leveraging:

- ✅ Modular architecture
- ✅ SOLID principles
- ✅ Dependency Injection using **Adapter Pattern**
- ✅ DRY codebase with centralized exception handling and configuration
- ✅ Scalable folder structure
- ✅ Docker & PostgreSQL integration
- ✅ Preconfigured email service (disabled by default)
- ✅ API documentation with Swagger
- ✅ Seeder route to bootstrap development data

It's designed to eliminate repetitive setup tasks, so you can focus on building features right away 🚀

Happy coding! 💻🔥
---

## 📁 Project Structure Highlights

- `src/modules/` – Modularized business logic per domain
- `@common/` – Shared services, guards, interceptors, constants, filters
- `src/core/` – Core abstractions, configurations, base services, DI adapters
- `src/infrastructure/` – ORM entities, persistence implementations, services
- `src/main.ts` – Application bootstrap and global configurations

---

## ⚙️ Features

| Feature                | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| **Modular Design**     | Each domain is isolated in its own module, promoting separation of concerns |
| **SOLID Principles**   | Designed to support maintainability and testability                         |
| **Adapters & DI**      | Implements the Adapter pattern for flexibility in infrastructure switching   |
| **Swagger**            | Auto-generated API docs at `/api`                                           |
| **Email Integration**  | Easily enable email sending via SMTP credentials                            |
| **Seeder**             | Populate the database with mock data via `/api/v1/seed`                     |
| **Docker**             | Includes `docker-compose` for instant PostgreSQL setup                      |

---

## 🧰 Prerequisites

Before getting started, ensure you have the following tools installed:

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Nest CLI](https://docs.nestjs.com/cli/overview) – `npm i -g @nestjs/cli`

---

## 🚀 Getting Started

Follow these steps to spin up the project in minutes:

### 1. Clone the repository

```bash
git clone https://github.com/your-username/nestjs-starter-template.git
cd nestjs-starter-template
```

### 2. Create your .env file
Start by copying the template:

```bash
cp .env.template .env
```

Then fill in the required values. By default:

Email service is disabled

The database will run using Docker

All other services will respect environment variables defined in .env

If you wish to enable email sending, set:
```bash
EMAIL_ENABLED=true
```
And make sure to fill the rest of the SMTP config fields.

### 3. Start PostgreSQL with Docker
```
docker-compose up -d
```
This will start a PostgreSQL container based on your .env file.

### 4. Install dependencies
```bash
npm install
```

### 5. Start the application
```bash
npm run start:dev
```
Visit: http://localhost:4000/api for Swagger API documentation.

## 🧪 Seed the database
For development purposes, you can populate the database with sample data using:
```
GET http://localhost:4000/api/v1/seed
```

## ⚙️ Custom Features

### 🔐 Auth Decorators & Guards
Use @Auth() to protect routes with ease.

@GetUser() decorator to extract the current authenticated user.

Role restriction supported with @Auth(ValidRoles.ADMIN) 🛑

### 🎯 Global Exception Handling
Global ExceptionFilter implemented to catch and format all thrown errors.

No need to manually handle try/catch blocks everywhere.

Error structure is consistent and ready for frontend parsing.

### 🔁 Interceptors
Global ResponseInterceptor formats all responses with a standard structure:
```
{
  "statusCode": 200,
  "message": "Successful operation.",
  "data": {...}
}

```

Keeps your frontend happy and reduces repetitive logic. ✨


## ✉️ Stay in touch
Author: Jose Fernando Hernández Angulo

LinkedIn: linkedin.com/in/jose-fernando-hdez

[LinkedIn](linkedin.com/in/josé-fernando-hernandez-7862882b9)


## 🤝 Contributing
Contributions, issues and feature requests are welcome!

Feel free to check the issues page if you want to contribute.



