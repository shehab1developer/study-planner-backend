const httpStatus = require('../utils/httpStatus');

// Must be used AFTER Auth middleware so req.user is populated
const isAdmin = (req, res, next) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({
                status:  httpStatus.FAIL,
                message: 'No user found',
            });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({
                status:  httpStatus.FAIL,
                message: 'Access denied – admin only',
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({ status: httpStatus.ERROR, message: error.message });
    }
};

module.exports = isAdmin;
