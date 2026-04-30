# Team Task Manager

A full-stack web application designed for teams to manage projects, assign tasks, and track progress with role-based access control.

## 🚀 Key Features

- **Authentication**: Secure Signup and Login using JWT.
- **Role-Based Access Control (RBAC)**: Differentiates between 'Admin' (can create projects and add members) and 'Member' roles.
- **Project & Team Management**: Admins can create projects and assign members from the workspace.
- **Task Tracking**: Create tasks within projects, assign them to members, set due dates, and track statuses (To Do, In Progress, Done).
- **Dashboard**: A comprehensive overview of personal statistics, including active projects, completed tasks, and a quick glance at assigned tasks.
- **Premium UI/UX**: Features a modern, vibrant glassmorphism design with smooth animations using React and Framer Motion.

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite), Framer Motion, Lucide React, Custom CSS (Glassmorphism).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ORM).
- **Authentication**: JSON Web Tokens (JWT), bcryptjs for password hashing.

## ⚙️ Running Locally

### Prerequisites
- Node.js installed
- MongoDB running locally or a MongoDB Atlas URI

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory with the following variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/team_task_manager
JWT_SECRET=your_super_secret_key
```
Start the backend server:
```bash
npm run dev
# or
node server.js
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Access the application at `http://localhost:5173`.

## 🌐 Deployment
This application is ready to be deployed on platforms like **Railway**, Vercel, or Render. 
- For Railway deployment, you can deploy the `backend` folder as a Node service and the `frontend` as a Static site (or Vercel for React).
- Make sure to add the necessary Environment Variables on Railway (`MONGO_URI`, `JWT_SECRET`).
