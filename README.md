# BookEasy API

A backend appointment booking API built with Node.js, Express, PostgreSQL, JWT Authentication, and bcrypt.

## Features

- User CRUD
- Service CRUD
- Appointment CRUD
- PostgreSQL database integration
- JWT Authentication
- Password hashing with bcrypt
- Protected routes
- Validation and error handling
- Foreign key relationships
- SQL JOIN queries

## Tech Stack

- Node.js
- Express
- PostgreSQL
- JWT
- bcrypt

## Installation

```bash
git clone https://github.com/rooseveltwb/bookeasy-api.git
cd bookeasy-api
npm install
```

Create a `.env` file:

```env
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bookeasy_api

JWT_SECRET=your_secret_key
```

Start the server:

```bash
npm run dev
```

## API Routes

### Auth

POST /api/auth/register

POST /api/auth/login

### Users

GET /api/users

GET /api/users/:id

POST /api/users

PUT /api/users/:id

DELETE /api/users/:id

### Services

GET /api/services

GET /api/services/:id

POST /api/services

PUT /api/services/:id

DELETE /api/services/:id

### Appointments

GET /api/appointments

GET /api/appointments/:id

POST /api/appointments

PUT /api/appointments/:id

DELETE /api/appointments/:id

## Authentication

Protected routes require:

Authorization: Bearer YOUR_TOKEN

## Author

Roosevelt Westbrook