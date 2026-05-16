# 🚀 Team Task Manager

> A full-stack collaborative project management platform built with the **MERN stack**, designed for teams to manage projects, assign tasks, and track progress — with role-based access control.

🔗 **Live Demo**: [https://team-task-manager-production-78fc.up.railway.app](https://team-task-manager-production-78fc.up.railway.app)

---

## 📸 Screenshots

| Login Page | Dashboard | Kanban Board |
|:---:|:---:|:---:|
| Glassmorphism auth UI | Analytics & progress tracking | Drag-and-drop task columns |

---

## ✨ Key Features

### 🔐 Authentication & Security
- Secure **JWT-based** authentication (Login & Register)
- Password hashing with **bcryptjs**
- Token-based session management

### 👥 Role-Based Access Control (RBAC)
- **Admin**: Create projects, add/manage team members, full control
- **Member**: View assigned projects, manage tasks within projects

### 📋 Project & Task Management
- Create and manage multiple projects
- Assign team members to projects
- **Kanban-style** task board with three columns: `To Do` → `In Progress` → `Done`
- Assign tasks to specific team members
- Set due dates and track deadlines

### 📊 Interactive Dashboard
- Visual **progress bars** showing completion rates
- Dynamic **Recharts** bar charts for task distribution analytics
- Quick overview of active projects, completed tasks, and in-progress items

### 🎨 Premium UI/UX
- Modern **glassmorphism** design with dark theme
- Smooth **Framer Motion** animations
- **Lucide React** icons throughout
- Fully responsive layout for all screen sizes
- Custom scrollbar, hover effects, and glow animations

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Framer Motion, Recharts, Lucide React, Custom CSS |
| **Backend** | Node.js, Express.js 5 |
| **Database** | MongoDB with Mongoose ODM |
| **Auth** | JSON Web Tokens (JWT), bcryptjs |
| **Deployment** | Railway (Monorepo) |

---

## 📁 Project Structure

```
Team-Task-Manager/
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification middleware
│   ├── models/
│   │   ├── User.js               # User schema (username, email, role)
│   │   ├── Project.js            # Project schema (name, owner, members)
│   │   └── Task.js               # Task schema (title, status, assignee)
│   ├── routes/
│   │   ├── auth.js               # Login, Register, Get user
│   │   ├── projects.js           # CRUD for projects
│   │   └── tasks.js              # CRUD for tasks
│   ├── server.js                 # Express server + MongoDB connection
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx        # Navigation bar with auth
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx     # Analytics dashboard
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── Register.jsx      # Registration page
│   │   │   ├── Projects.jsx      # Projects list view
│   │   │   └── ProjectDetails.jsx # Kanban task board
│   │   ├── App.jsx               # Main router
│   │   ├── App.css               # Component styles
│   │   ├── index.css             # Global design system
│   │   └── main.jsx              # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── nixpacks.toml                 # Railway build config
├── package.json                  # Monorepo root scripts
└── README.md
```

---

## ⚙️ Running Locally

### Prerequisites
- **Node.js** v18 or higher
- **MongoDB** (local installation or [MongoDB Atlas](https://www.mongodb.com/atlas) cloud)

### 1. Clone the Repository
```bash
git clone https://github.com/shivangi-manna/Team-Task-Manager.git
cd Team-Task-Manager
```

### 2. Setup Environment Variables
Create a `.env` file inside the `backend/` directory:
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

### 3. Start the Backend
```bash
cd backend
npm install
npm run dev
```
> Backend runs at `http://localhost:5001`

### 4. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
> Frontend runs at `http://localhost:5173`

---

## 🌐 Deployment on Railway

This app is deployed as a **unified monorepo** on [Railway](https://railway.app).

### How it works:
1. Railway detects the root `package.json` and `nixpacks.toml`
2. `postinstall` hook auto-installs both backend and frontend dependencies
3. `npm run build` builds the React frontend into static files
4. `npm start` launches the Express server, which serves the built frontend

### Required Environment Variables on Railway:
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string (Railway MongoDB or Atlas) |
| `JWT_SECRET` | Secret key for JWT token signing |

---

## 👩‍💻 Author

**Shivangi Manna**
- GitHub: [@shivangi-manna](https://github.com/shivangi-manna)

---

## 📄 License

This project is open source and available under the [ISC License](LICENSE).
