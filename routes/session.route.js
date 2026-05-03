const router = require('express').Router();
const Auth   = require('../middlewares/Auth');
const {
    getSessions, createSession,
    getSessionById, deleteSession,
} = require('../controllers/session.controller');

router.use(Auth);

router.get('/',      getSessions);
router.post('/',     createSession);
router.get('/:id',   getSessionById);
router.delete('/:id', deleteSession);

module.exports = router;
