const Task         = require('../models/task.model');
const Subject      = require('../models/subject.model');
const StudySession = require('../models/studySession.model');
const httpStatus   = require('../utils/httpStatus');

// GET /api/stats
const getStats = async (req, res) => {
    try {
        const userId = req.userId;

        const [
            totalTasks,
            completedTasks,
            pendingTasks,
            totalSubjects,
            totalSessions,
            subjects,
        ] = await Promise.all([
            Task.countDocuments({ user: userId }),
            Task.countDocuments({ user: userId, status: 'completed' }),
            Task.countDocuments({ user: userId, status: 'pending' }),
            Subject.countDocuments({ user: userId }),
            StudySession.countDocuments({ user: userId }),
            Subject.find({ user: userId }).select('name studiedHours targetHours color'),
        ]);

        // Total study minutes across all sessions
        const sessionAgg = await StudySession.aggregate([
            { $match: { user: userId } },
            { $group: { _id: null, totalMinutes: { $sum: '$durationMinutes' } } },
        ]);
        const totalStudyMinutes = sessionAgg[0]?.totalMinutes || 0;

        return res.status(200).json({
            status: httpStatus.SUCCESS,
            data: {
                tasks: { total: totalTasks, completed: completedTasks, pending: pendingTasks },
                subjects: { total: totalSubjects, list: subjects },
                sessions: { total: totalSessions, totalStudyMinutes },
            },
        });
    } catch (err) {
        return res.status(500).json({ status: httpStatus.ERROR, message: err.message });
    }
};

module.exports = { getStats };
