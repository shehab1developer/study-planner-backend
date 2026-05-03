require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const ConnectDB = require('./DataBase');

const authRoutes = require('./routes/auth.route');
const subjectRoutes = require('./routes/subject.route');
const taskRoutes = require('./routes/task.route');
const sessionRoutes = require('./routes/session.route');
const statsRoutes = require('./routes/stats.route');

const app = express();

// ── Security & Parsing Middleware ──────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/tasks',    taskRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/stats',    statsRoutes);

// ── Global Error Handler ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ status: 'error', message: err.message });
});

// ── Start Server ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
ConnectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
