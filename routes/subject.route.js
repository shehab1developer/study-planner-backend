const router = require('express').Router();
const Auth   = require('../middlewares/Auth');
const {
    getSubjects, createSubject,
    getSubjectById, updateSubject, deleteSubject,
} = require('../controllers/subject.controller');

router.use(Auth); // all subject routes require authentication

router.get('/',     getSubjects);
router.post('/',    createSubject);
router.get('/:id',  getSubjectById);
router.patch('/:id', updateSubject);
router.delete('/:id', deleteSubject);

module.exports = router;
