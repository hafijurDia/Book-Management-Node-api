# Library Management System

A RESTful API built with Node.js, TypeScript, Express, and MongoDB for managing a library's books, borrowing, and reports. Deployed seamlessly on Vercel with environment variables for secure configuration.

---

## Features

- Manage books: create, update, delete, list with filtering & sorting
- Borrow books with business logic (availability & copies)
- View borrowed books summary using aggregation
- Environment variable configuration
- Deployment on Vercel

---

## Technologies

- **Node.js & TypeScript**
- **Express.js**
- **MongoDB & Mongoose**
- **Vercel (Serverless deployment)**
- **dotenv for environment variables**

---

## Setup & Installation

### Prerequisites

- Node.js (>=14.x)
- npm or yarn
- MongoDB Atlas account (cloud-hosted MongoDB)


Your server runs at `http://localhost:3000`.

---

## API Endpoints

### Books

| Method | Endpoint               | Description                               | Request Body Example                                              |
|---------|------------------------|-------------------------------------------|-------------------------------------------------------------------|
| POST    | `/api/books/create-book` | Add a new book                          | See [Create Book](#create-book)                                    |
| GET     | `/api/books/get-all`     | List books with filtering & sorting     | Query params: `filter`, `sortBy`, `sort`, `limit`               |
| PUT     | `/api/books/:bookId`     | Update book details                     | `{ "copies": 50 }`                                               |
| PATCH   | `/api/books/:bookId`     | Partial update (e.g., copies)           | `{ "copies": 50 }`                                               |

### Borrowing

| Method | Endpoint                | Description                                              | Request Body Example                                      |
|---------|-------------------------|----------------------------------------------------------|-----------------------------------------------------------|
| POST    | `/api/borrow`           | Borrow a book (business logic applies)                   | See [Borrow a Book](#borrow-a-book)                        |
| GET     | `/api/borrow`           | Get summary of borrowed books using aggregation          | No body needed                                           |

---

## Example Usage

### Create a new book

POST `/api/books/create-book`



