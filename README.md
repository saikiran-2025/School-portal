# School-portal
The School Portal Application is a full-stack academic management system developed using the MERN stack (MongoDB, Express.js, React.js, Node.js). The application is designed to provide a secure, role-based digital platform for managing student and faculty information, academic records, and class timetables in an organized and efficient manner.This system enables two primary user roles: Students and Faculty, each with controlled access based on authentication and authorization mechanisms implemented using JSON Web Token (JWT).

🚀 Tech Stack Used:-

💻 Frontend:
React.js:-
  React Hooks: useState,useEffect,useContext
  Context API (Global State Management)
  Axios (API Communication)
  Modern Responsive CSS

🖥 Backend:
Node.js:-
 Express.js
 RESTful API Architecture
 Middleware-based routing

🗄 Database:-
 MongoDB Atlas
 Mongoose ODM

🔐 Authentication & Security:-
 JSON Web Token (JWT)
 Role-Based Access Control (Student / Faculty)
 Protected Routes

🔄 API Communication:-
 Axios for frontend-backend integration
 Express REST APIs
 JSON-based request/response handling

🧱 Project Architecture:-
 School-Portal/
│
├── frontend/                # React Application
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/                 # Node + Express Server
│   ├── models/              # Mongoose Schemas
│   ├── routers/             # API Routes
│   ├── controllers/         # Business Logic
│   ├── middleware/          # Auth Middleware
│   ├── index.js             # Entry Point
│   └── package.json
│
└── README.md
