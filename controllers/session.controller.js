const StudySession = require('../models/studySession.model');
const Subject      = require('../models/subject.model');
const httpStatus   = require('../utils/httpStatus');

// GET /api/sessions
const getSessions = async (req, res) => {
    try {
        const sessions = await StudySession.find({ user: req.userId })
            .populate('subject', 'name color')
            .sort({ startTime: -1 });

        return res.status(200).json({ status: httpStatus.SUCCESS, data: sessions });
    } catch (err) {
        return res.status(500).json({ status: httpStatus.ERROR, message: err.message });
    }
};

// POST /api/sessions
const createSession = async (req, res) => {
    try {
        const { subject, startTime, endTime, durationMinutes, notes } = req.body;

        if (!subject) {
            return res.status(400).json({
                status:  httpStatus.FAIL,
                message: 'Subject is required',
            });
        }

        const session = await StudySession.create({
            subject, startTime, endTime, durationMinutes, notes,
            user: req.userId,
        });

        // Update studiedHours on the subject
        if (session.durationMinutes) {
            await Subject.findByIdAndUpdate(subject, {
                $inc: { studiedHours: session.durationMinutes / 60 },
            });
        }

        return res.status(201).json({ status: httpStatus.SUCCESS, data: session });
    } catch (err) {
        return res.status(500).json({ status: httpStatus.ERROR, message: err.message });
    }
};

// GET /api/sessions/:id
const getSessionById = async (req, res) => {
    try {
        const session = await StudySession.findOne({ _id: req.params.id, user: req.userId })
            .populate('subject', 'name color');
        if (!session) {
            return res.status(404).json({ status: httpStatus.FAIL, message: 'Session not found' });
        }
        return res.status(200).json({ status: httpStatus.SUCCESS, data: session });
    } catch (err) {
        return res.status(500).json({ status: httpStatus.ERROR, message: err.message });
    }
};

// DELETE /api/sessions/:id
const deleteSession = async (req, res) => {
    try {
        const session = await StudySession.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!session) {
            return res.status(404).json({ status: httpStatus.FAIL, message: 'Session not found' });
        }
        return res.status(200).json({ status: httpStatus.SUCCESS, message: 'Session deleted' });
    } catch (err) {
        return res.status(500).json({ status: httpStatus.ERROR, message: err.message });
    }
};

module.exports = { getSessions, createSession, getSessionById, deleteSession };
