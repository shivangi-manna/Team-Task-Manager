const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5001;

const { MongoMemoryServer } = require('mongodb-memory-server');

// Database Connection
const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;
    if (!uri) {
      const mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
      console.log('Using in-memory MongoDB');
    }
    
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
  }
};

connectDB();
