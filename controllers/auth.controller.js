const jwt        = require('jsonwebtoken');
const User       = require('../models/user.model');
const httpStatus = require('../utils/httpStatus');

// ── Helpers ────────────────────────────────────────────────────────────────
const generateToken = (userId) =>
    jwt.sign({ _id: userId }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

const setTokenCookie = (res, token) =>
    res.cookie('jwt_token', token, {
        httpOnly: true,
        secure:   process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days
    });

// ── Register ───────────────────────────────────────────────────────────────
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                status:  httpStatus.FAIL,
                message: 'Name, email and password are required',
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                status:  httpStatus.FAIL,
                message: 'Email already in use',
            });
        }

        const user  = await User.create({ name, email, password });
        const token = generateToken(user._id);
        setTokenCookie(res, token);

        return res.status(201).json({
            status: httpStatus.SUCCESS,
            data: {
                _id:        user._id,
                name:       user.name,
                email:      user.email,
                role:       user.role,
                isVerified: user.isVerified,
            },
        });
    } catch (err) {
        return res.status(500).json({ status: httpStatus.ERROR, message: err.message });
    }
};

// ── Login ──────────────────────────────────────────────────────────────────
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status:  httpStatus.FAIL,
                message: 'Email and password are required',
            });
        }

        // .select('+password') because password has select:false on the schema
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                status:  httpStatus.FAIL,
                message: 'Invalid email or password',
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                status:  httpStatus.FAIL,
                message: 'Invalid email or password',
            });
        }

        const token = generateToken(user._id);
        setTokenCookie(res, token);

        return res.status(200).json({
            status: httpStatus.SUCCESS,
            data: {
                _id:        user._id,
                name:       user.name,
                email:      user.email,
                role:       user.role,
                isVerified: user.isVerified,
            },
        });
    } catch (err) {
        return res.status(500).json({ status: httpStatus.ERROR, message: err.message });
    }
};

// ── Logout ─────────────────────────────────────────────────────────────────
const logout = (req, res) => {
    res.clearCookie('jwt_token');
    return res.status(200).json({ status: httpStatus.SUCCESS, message: 'Logged out' });
};

module.exports = { register, login, logout };
