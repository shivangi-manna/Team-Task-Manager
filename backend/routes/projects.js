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
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Create a project
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, members } = req.body;

    if (!name) {
      return res.status(400).json({ msg: 'Project name is required' });
    }

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
    const populated = await Project.findById(project._id)
      .populate('owner', 'username email')
      .populate('members', 'username email');
    res.json(populated);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Add member to project (Admin only)
router.put('/:id/members', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    // Only owner (admin) can add members
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized. Only project admin can add members.' });
    }

    const { userId } = req.body;
    if (!project.members.includes(userId)) {
      project.members.push(userId);
      await project.save();
    }

    const populated = await Project.findById(project._id)
      .populate('owner', 'username email')
      .populate('members', 'username email');
    res.json(populated);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Remove member from project (Admin only)
router.delete('/:id/members/:userId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized. Only project admin can remove members.' });
    }

    project.members = project.members.filter(m => m.toString() !== req.params.userId);
    await project.save();

    const populated = await Project.findById(project._id)
      .populate('owner', 'username email')
      .populate('members', 'username email');
    res.json(populated);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Get users to add as members
router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
