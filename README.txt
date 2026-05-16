# Team Task Manager

A full-stack web application designed for teams to manage projects, assign tasks, and track progress with role-based access control.

## 🚀 Key Features

- **Authentication**: Secure Signup and Login using JWT.
- **Role-Based Access Control (RBAC)**: Differentiates between 'Admin' (can create projects and add members) and 'Member' roles.
- **Project & Team Management**: Admins can create projects and assign members from the workspace.
- **Task Tracking**: Create tasks within projects, assign them to members, set due dates, and track statuses (To Do, In Progress, Done).
- **Interactive Dashboard**: A comprehensive overview featuring visual progress bars and dynamic **Recharts** analytics for task distribution.
- **Premium UI/UX**: Features a modern, vibrant glassmorphism design with smooth hover animations using React and Framer Motion.

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite), Framer Motion, Recharts, Lucide React, Custom CSS (Glassmorphism).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ORM).
- **Authentication**: JSON Web Tokens (JWT), bcryptjs for password hashing.

## ⚙️ Running Locally

The project is structured as a **Monorepo**. You can run both the frontend and backend locally with ease.

### Prerequisites
- Node.js installed (v18+)
- A MongoDB database (local or cloud like MongoDB Atlas)

### 1. Setup

Create a `.env` file in the `backend` directory:
```
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

Open two separate terminal windows/tabs:

**Terminal 1 (Backend):**
```bash
cd backend
npm install
npm run dev
```
*The backend will run on `http://localhost:5001`.*

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev
```
*The frontend will run on `http://localhost:5174` (or 5173).*

## 🌐 Deployment (Railway)

This application is configured for a seamless, one-click deployment on **Railway** as a unified Monorepo.

1. Connect your GitHub repository to a new Railway project.
2. Railway will automatically detect the root `package.json` and the `nixpacks.toml` config.
3. **Required**: Add a MongoDB service in your Railway project (or use MongoDB Atlas).
4. Go to your application's **Variables** tab in Railway and add:
   - `MONGO_URI` (your MongoDB connection string)
   - `JWT_SECRET` (add a secure random string)
5. Railway will build the frontend and start the Express backend which serves the built React frontend!
