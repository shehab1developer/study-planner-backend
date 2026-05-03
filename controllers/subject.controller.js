const Subject    = require('../models/subject.model');
const httpStatus = require('../utils/httpStatus');

// GET /api/subjects
const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({ user: req.userId }).sort({ createdAt: -1 });
        return res.status(200).json({ status: httpStatus.SUCCESS, data: subjects });
    } catch (err) {
        return res.status(500).json({ status: httpStatus.ERROR, message: err.message });
    }
};

// POST /api/subjects
const createSubject = async (req, res) => {
    try {
        const { name, description, color, targetHours } = req.body;

        if (!name) {
            return res.status(400).json({
                status:  httpStatus.FAIL,
                message: 'Subject name is required',
            });
        }

        const subject = await Subject.create({
            name,
            description,
            color,
            targetHours,
            user: req.userId,
        });

        return res.status(201).json({ status: httpStatus.SUCCESS, data: subject });
    } catch (err) {
        return res.status(500).json({ status: httpStatus.ERROR, message: err.message });
    }
};

// GET /api/subjects/:id
const getSubjectById = async (req, res) => {
    try {
        const subject = await Subject.findOne({ _id: req.params.id, user: req.userId });
        if (!subject) {
            return res.status(404).json({ status: httpStatus.FAIL, message: 'Subject not found' });
        }
        return res.status(200).json({ status: httpStatus.SUCCESS, data: subject });
    } catch (err) {
        return res.status(500).json({ status: httpStatus.ERROR, message: err.message });
    }
};

// PATCH /api/subjects/:id
const updateSubject = async (req, res) => {
    try {
        const subject = await Subject.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!subject) {
            return res.status(404).json({ status: httpStatus.FAIL, message: 'Subject not found' });
        }
        return res.status(200).json({ status: httpStatus.SUCCESS, data: subject });
    } catch (err) {
        return res.status(500).json({ status: httpStatus.ERROR, message: err.message });
    }
};

// DELETE /api/subjects/:id
const deleteSubject = async (req, res) => {
    try {
        const subject = await Subject.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!subject) {
            return res.status(404).json({ status: httpStatus.FAIL, message: 'Subject not found' });
        }
        return res.status(200).json({ status: httpStatus.SUCCESS, message: 'Subject deleted' });
    } catch (err) {
        return res.status(500).json({ status: httpStatus.ERROR, message: err.message });
    }
};

module.exports = { getSubjects, createSubject, getSubjectById, updateSubject, deleteSubject };
