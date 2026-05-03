const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema(
    {
        user: {
            type:     mongoose.Schema.Types.ObjectId,
            ref:      'User',
            required: true,
        },
        subject: {
            type:     mongoose.Schema.Types.ObjectId,
            ref:      'Subject',
            required: true,
        },
        startTime: {
            type:     Date,
            required: true,
            default:  Date.now,
        },
        endTime: {
            type: Date,
        },
        durationMinutes: {
            type:    Number,          // computed or manually set
            default: 0,
        },
        notes: {
            type:    String,
            trim:    true,
            default: '',
        },
    },
    { timestamps: true }
);

// Auto-compute durationMinutes when endTime is set
studySessionSchema.pre('save', function (next) {
    if (this.startTime && this.endTime) {
        this.durationMinutes = Math.round(
            (this.endTime - this.startTime) / 60000
        );
    }
    next();
});

const StudySession = mongoose.model('StudySession', studySessionSchema);
module.exports = StudySession;
