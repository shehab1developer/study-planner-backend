const jwt        = require('jsonwebtoken');
const User       = require('../models/user.model');
const httpStatus = require('../utils/httpStatus');

const Auth = async (req, res, next) => {
    try {
        // Accept token from cookie OR Authorization header
        const token =
            req.cookies?.jwt_token ||
            (req.headers.authorization?.startsWith('Bearer ')
                ? req.headers.authorization.split(' ')[1]
                : null);

        if (!token) {
            return res.status(401).json({
                status:  httpStatus.FAIL,
                message: 'Unauthorized – no token provided',
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).json({
                status:  httpStatus.FAIL,
                message: 'Unauthorized – user no longer exists',
            });
        }

        req.user   = user;
        req.userId = user._id;
        next();
    } catch (error) {
        return res.status(401).json({
            status:  httpStatus.FAIL,
            message: 'Unauthorized – invalid or expired token',
        });
    }
};

module.exports = Auth;
