# IITH Project Backend

## Overview

This repository contains the backend for a task management API built with Node.js, Express, and MongoDB. It supports user registration, login, and authenticated task operations including creation, retrieval, update, and soft deletion.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv
- bcryptjs
- jsonwebtoken
- cookie-parser
- express-validator
- validator

## Project Structure

```
IITH project/
├─ .env
├─ package.json
├─ README.md
├─ server.js
└─ src/
   ├─ app.js
   ├─ db/
   │  └─ db.js
   ├─ controllers/
   │  ├─ auth.controller.js
   │  └─ task.controller.js
   ├─ middlewear/
   │  ├─ auth.middlewear.js
   │  └─ validation.middlewear.js
   ├─ models/
   │  ├─ task.model.js
   │  └─ user.model.js
   └─ routes/
      ├─ auth.routes.js
      └─ task.routes.js
```

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB database URI

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with the following values:

```env
MONGO_URI=mongodb://<username>:<password>@<host>/<database>
JWT_SECRET=your_jwt_secret_here
```

3. Start the server:

```bash
node server.js
```

4. Open `http://localhost:3000` for API access.

## API Endpoints

### Authentication

#### Register a new user

- Method: `POST`
- URL: `/api/auth/register`
- Body:
  - `username` (string, required)
  - `email` (string, required)
  - `password` (string, required)
  - `role` (string, required, either `admin` or `user`)

- Notes:
  - Registration uses validation middleware.
  - Passwords are hashed with bcrypt.
  - On success, a JWT token is set in a `token` cookie.

Example request body:

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

#### Login an existing user

- Method: `POST`
- URL: `/api/auth/login`
- Body:
  - `username` or `email`
  - `password`

- Notes:
  - On success, a JWT token is set in a `token` cookie.

Example request body:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Task Management

> All task endpoints require authentication. The `auth.middlewear.js` middleware checks the `token` cookie and attaches decoded user data to `req.user`.

#### Create a task

- Method: `POST`
- URL: `/api/tasks/create`
- Body:
  - `title` (string, required)
  - `description` (string)
  - `status` (string: `todo`, `in-progress`, `done`)
  - `priority` (string: `low`, `medium`, `high`)
  - `dueDate` (date string)
  - `assignedTo` (User ID, required)

- Notes:
  - The authenticated user becomes `createdBy`.

Example request body:

```json
{
  "title": "Finish sprint report",
  "description": "Compile metrics and progress data",
  "status": "todo",
  "priority": "high",
  "dueDate": "2026-05-01T00:00:00.000Z",
  "assignedTo": "646c..."
}
```

#### Fetch tasks

- Method: `GET`
- URL: `/api/tasks/fetch`
- Query parameters:
  - `status` (optional)
  - `priority` (optional)
  - `search` (optional)
  - `sort` (optional field name)
  - `page` (optional, default `1`)
  - `limit` (optional, default `10`)

Example:

```
GET /api/tasks/fetch?status=todo&priority=high&page=1&limit=10
```

#### Update a task

- Method: `PATCH`
- URL: `/api/tasks/update/:id`
- Path parameter:
  - `id` (task ID)
- Body: Any updatable task fields

Example request body:

```json
{
  "status": "in-progress",
  "priority": "medium"
}
```

#### Delete a task

- Method: `DELETE`
- URL: `/api/tasks/delete/:id`
- Path parameter:
  - `id` (task ID)

- Notes:
  - This performs a soft delete by setting `isDeleted` to `true`.

## Models

### User

- `username` (String, unique, required)
- `email` (String, unique, required)
- `password` (String, required)
- `role` (String, enum: `admin`, `user`)
- `createdAt` (Date)

### Task

- `title` (String, required)
- `description` (String)
- `status` (String, enum: `todo`, `in-progress`, `done`)
- `priority` (String, enum: `low`, `medium`, `high`)
- `dueDate` (Date)
- `createdBy` (ObjectId ref `User`)
- `assignedTo` (ObjectId ref `User`)
- `isDeleted` (Boolean)
- `createdAt` (Date)
- `updatedAt` (Date)

## Notes

- The app listens on port `3000`.
- Environment settings are loaded from `.env` using dotenv.
- User authentication is handled by JWT tokens stored in cookies.
- Validation middleware is applied to the registration route.
