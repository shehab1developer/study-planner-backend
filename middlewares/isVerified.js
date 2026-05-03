const httpStatus = require('../utils/httpStatus');

// Must be used AFTER Auth middleware so req.user is populated
const isVerified = (req, res, next) => {
    if (!req.user?.isVerified) {
        return res.status(403).json({
            status:  httpStatus.FORBIDDEN,
            message: 'Please verify your email address first',
        });
    }
    next();
};

module.exports = isVerified;
