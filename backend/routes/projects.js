const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

// Get all projects for logged in user
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user.id }, { members: req.user.id }]
    }).populate('owner', 'username email').populate('members', 'username email');
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create a project
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, members } = req.body;
    
    // Add owner to members if not already
    let projectMembers = members || [];
    if (!projectMembers.includes(req.user.id)) {
      projectMembers.push(req.user.id);
    }

    const newProject = new Project({
      name,
      description,
      owner: req.user.id,
      members: projectMembers
    });

    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get users to add as members
router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
