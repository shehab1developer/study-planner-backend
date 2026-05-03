const Task       = require('../models/task.model');
const httpStatus = require('../utils/httpStatus');

// GET /api/tasks
const getTasks = async (req, res) => {
    try {
        const filter = { user: req.userId };

        // Optional query filters
        if (req.query.status)   filter.status   = req.query.status;
        if (req.query.priority) filter.priority = req.query.priority;
        if (req.query.subject)  filter.subject  = req.query.subject;

        const tasks = await Task.find(filter)
            .populate('subject', 'name color')
            .sort({ dueDate: 1, createdAt: -1 });

        return res.status(200).json({ status: httpStatus.SUCCESS, data: tasks });
    } catch (err) {
        return res.status(500).json({ status: httpStatus.ERROR, message: err.message });
    }
};

// POST /api/tasks
const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate, subject } = req.body;

        if (!title) {
            return res.status(400).json({ status: httpStatus.FAIL, message: 'Task title is required' });
        }

        const task = await Task.create({
            title, description, status, priority, dueDate, subject,
            user: req.userId,
        });

        return res.status(201).json({ status: httpStatus.SUCCESS, data: task });
    } catch (err) {
        return res.status(500).json({ status: httpStatus.ERROR, message: err.message });
    }
};

// GET /api/tasks/:id
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.userId })
            .populate('subject', 'name color');
        if (!task) {
            return res.status(404).json({ status: httpStatus.FAIL, message: 'Task not found' });
        }
        return res.status(200).json({ status: httpStatus.SUCCESS, data: task });
    } catch (err) {
        return res.status(500).json({ status: httpStatus.ERROR, message: err.message });
    }
};

// PATCH /api/tasks/:id
const updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!task) {
            return res.status(404).json({ status: httpStatus.FAIL, message: 'Task not found' });
        }
        return res.status(200).json({ status: httpStatus.SUCCESS, data: task });
    } catch (err) {
        return res.status(500).json({ status: httpStatus.ERROR, message: err.message });
    }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!task) {
            return res.status(404).json({ status: httpStatus.FAIL, message: 'Task not found' });
        }
        return res.status(200).json({ status: httpStatus.SUCCESS, message: 'Task deleted' });
    } catch (err) {
        return res.status(500).json({ status: httpStatus.ERROR, message: err.message });
    }
};

module.exports = { getTasks, createTask, getTaskById, updateTask, deleteTask };
