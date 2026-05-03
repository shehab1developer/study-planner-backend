const router = require('express').Router();
const Auth   = require('../middlewares/Auth');
const { getStats } = require('../controllers/stats.controller');

router.use(Auth);

router.get('/', getStats);

module.exports = router;
