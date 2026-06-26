# Online Complaint Registration & Management System

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application for submitting, tracking, and resolving complaints, with role-based access for Users, Agents, and Admins.

## Features

- **JWT-based authentication** with secure password hashing (bcrypt)
- **Role-based access control** — User, Agent, Admin
- **Complaint lifecycle management** — Open → In Progress → Resolved/Closed/Rejected
- **Agent assignment** — Admins assign complaints to available agents
- **In-app messaging** — Users and Agents communicate directly on each complaint
- **Feedback & ratings** — Users rate their resolution experience after a complaint is resolved
- **Admin analytics dashboard** — user counts, complaint counts by status/category, average satisfaction rating
- **Responsive UI** built with React and React Router

## Tech Stack

**Frontend:** React.js, React Router, Axios, React Toastify
**Backend:** Node.js, Express.js
**Database:** MongoDB (Atlas)
**Authentication:** JSON Web Tokens (JWT), bcrypt.js
**Validation:** express-validator

## Project Structure

\```
complaint-system/
├── server/
│   ├── config/        # Database connection
│   ├── controllers/   # Business logic (auth, complaints, feedback, admin)
│   ├── middleware/     # JWT auth & error handling
│   ├── models/         # Mongoose schemas (User, Complaint, Feedback)
│   ├── routes/         # API route definitions
│   ├── seeder.js        # Sample data seeder
│   └── index.js         # App entry point
├── client/
│   ├── public/
│   └── src/
│       ├── components/shared/  # Navbar, Loader, StatusBadge
│       ├── context/             # AuthContext (global auth state)
│       ├── pages/                # Home, Login, Register, Dashboard, etc.
│       └── utils/api.js          # Axios instance with auth interceptor
└── README.md
\```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- A MongoDB Atlas account (free tier) or local MongoDB instance

### 1. Backend Setup

\```bash
npm install
\```

Create a `.env` file in the project root:

\```
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
\```

Seed the database with sample data:

\```bash
node server/seeder.js
\```

Start the backend server:

\```bash
npm run dev
\```

The API will be available at `http://localhost:5000`. Verify with `http://localhost:5000/api/health`.

### 2. Frontend Setup

\```bash
cd client
npm install
npm start
\```

The app will open at `http://localhost:3000`.

## Demo Credentials

| Role  | Email              | Password   |
|-------|--------------------|------------|
| Admin | admin@demo.com     | admin1234  |
| Agent | agent1@demo.com    | agent1234  |
| Agent | agent2@demo.com    | agent1234  |
| User  | user@demo.com      | user1234   |
| User  | user2@demo.com     | user1234   |

## API Overview

| Method | Endpoint                      | Access        | Description                  |
|--------|--------------------------------|----------------|-------------------------------|
| POST   | /api/auth/register             | Public         | Register a new user          |
| POST   | /api/auth/login                | Public         | Login                         |
| GET    | /api/auth/me                   | Authenticated  | Get current user              |
| GET    | /api/complaints                | Authenticated  | List complaints (role-scoped)|
| POST   | /api/complaints                | User           | Submit a new complaint        |
| GET    | /api/complaints/:id            | Authenticated  | Get complaint details         |
| PUT    | /api/complaints/:id/status     | Agent/Admin    | Update complaint status       |
| PUT    | /api/complaints/:id/assign     | Admin          | Assign an agent                |
| POST   | /api/complaints/:id/messages   | Authenticated  | Send a chat message           |
| POST   | /api/feedback                  | User           | Submit feedback                |
| GET    | /api/admin/stats               | Admin          | Dashboard statistics           |
| GET    | /api/admin/users               | Admin          | List all users                 |

## Future Enhancements

- File attachments on complaints
- Email notifications (nodemailer)
- WebSocket-based real-time chat
- Advanced analytics with charts

## Author

Ashritha Ponugoti — B.Tech CSE, Anurag University