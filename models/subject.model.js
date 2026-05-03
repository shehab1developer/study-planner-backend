const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
    {
        name: {
            type:     String,
            required: [true, 'Subject name is required'],
            trim:     true,
        },
        description: {
            type:    String,
            trim:    true,
            default: '',
        },
        color: {
            type:    String,          // hex color for UI, e.g. "#FF5733"
            default: '#4A90D9',
        },
        user: {
            type:     mongoose.Schema.Types.ObjectId,
            ref:      'User',
            required: true,
        },
        targetHours: {
            type:    Number,
            default: 0,
        },
        studiedHours: {
            type:    Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const Subject = mongoose.model('Subject', subjectSchema);
module.exports = Subject;
