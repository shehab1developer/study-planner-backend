const router = require('express').Router();
const Auth   = require('../middlewares/Auth');
const {
    getTasks, createTask,
    getTaskById, updateTask, deleteTask,
} = require('../controllers/task.controller');

router.use(Auth);

router.get('/',      getTasks);
router.post('/',     createTask);
router.get('/:id',   getTaskById);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
