const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/authMiddleware');

// Get all tasks for a specific project
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId }).populate('assignee', 'username email');
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Create a task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, project, assignee, status, priority, dueDate } = req.body;

    if (!title || !project) {
      return res.status(400).json({ msg: 'Title and project are required' });
    }

    const newTask = new Task({
      title,
      description,
      project,
      assignee: assignee || undefined,
      status: status || 'To Do',
      priority: priority || 'Medium',
      dueDate: dueDate || undefined
    });

    const task = await newTask.save();
    const populated = await Task.findById(task._id).populate('assignee', 'username email');
    res.json(populated);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Update task status/priority
router.put('/:id', auth, async (req, res) => {
  try {
    const { status, priority } = req.body;
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    if (status) task.status = status;
    if (priority) task.priority = priority;
    await task.save();

    const populated = await Task.findById(task._id).populate('assignee', 'username email');
    res.json(populated);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    await task.deleteOne();
    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
