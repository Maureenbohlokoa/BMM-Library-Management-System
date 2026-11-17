# BMM Library Management System

## Project Overview

The BMM Library Management System is a web-based application developed to simplify and improve library operations. It provides administrators with tools to manage books, members, stock and borrowing transactions, while allowing registered members to access the library catalogue.

The system uses a React frontend, an Express.js backend and a MySQL database.

## Main Features

### 1. User Authentication
- Administrator and member login.
- Secure password hashing.
- JSON Web Token (JWT) authentication.
- Member self-registration.
- Automatic membership ID generation in the format BMM-001, BMM-002, BMM-003, and so on.

### 2. Book Management
- Add new books.
- View available books.
- Update book information.
- Remove books from active listings.
- Track book quantities and availability.
- Record book titles, authors, genres and ISBNs.

### 3. Member Management
- Register new members.
- Automatically generate unique membership IDs.
- View member information.
- Update member details.
- Delete member accounts.

### 4. Transaction Management
- Record new stock.
- Borrow books.
- Return books.
- Track available book quantities.
- Maintain transaction records.

### 5. Dashboards
- Administrator dashboard.
- Member dashboard.
- Member catalogue.

## Technologies Used

### Frontend
- React
- Vite
- JavaScript
- HTML
- CSS
- React Router
- Lucide React

### Backend
- Node.js
- Express.js
- MySQL2
- JSON Web Tokens (JWT)
- bcryptjs
- CORS
- dotenv

### Database
- MySQL

## Project Structure

```text
BMM-Library-Management-System/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   ├── package.json
│   └── README.md
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md
```

## Installation and Setup

### Prerequisites

Install the following before running the application:

- Node.js and npm
- MySQL Server
- MySQL Workbench (recommended)
- A code editor such as Sublime Text

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd BMM-Library-Management-System
```

### 2. Set Up the Database

1. Open MySQL Workbench.
2. Create a database named `bmm_library`.
3. Create the required tables: `users`, `members`, `books` and `transactions`.
4. Configure the database connection in the backend environment file.

### 3. Configure Backend Environment Variables

Create a `.env` file inside the `backend` folder.

Configure the following variables using your own local database credentials and a private JWT secret:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=bmm_library
JWT_SECRET=YOUR_PRIVATE_JWT_SECRET
```

Never upload your actual `.env` file or private credentials to GitHub.

### 4. Start the Backend

Open a terminal in the backend folder:

```bash
cd backend
npm install
npm start
```

The backend runs at:

`http://localhost:5000`

### 5. Start the Frontend

Open another terminal in the frontend folder:

```bash
cd frontend
npm install
npm run dev
```

Open the local development URL displayed in the terminal.

## API Routes

| Resource | Endpoint | Purpose |
|---|---|---|
| Authentication | `/api/auth/login` | User login |
| Members | `/api/members/register` | Member registration |
| Members | `/api/members` | Member management |
| Books | `/api/books` | Book management |
| Transactions | `/api/transactions` | Transaction history |
| Transactions | `/api/transactions/stock-in` | Add stock |
| Transactions | `/api/transactions/borrow` | Borrow books |
| Transactions | `/api/transactions/return` | Return books |

Protected routes require the appropriate authentication and permissions.

## Design

The BMM Library Management System uses a clean and modern visual design with the following signature colours:

- Baby pink
- Dark pink
- Sky blue
- White

The interface aims to provide a simple, attractive and user-friendly experience.

## Project Objectives

- Improve the efficiency of library operations.
- Simplify book and member management.
- Maintain accurate stock records.
- Track borrowing and returning activities.
- Provide secure access for administrators and members.
- Reduce manual record keeping.

## Author

**BMM Library Management System**

Developed as an academic web application project.