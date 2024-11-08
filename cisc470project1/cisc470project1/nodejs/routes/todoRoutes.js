// routes/todoRoutes.js
const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, todoController.createTodo);
router.get('/', authMiddleware, todoController.getTodos);
router.post('/share', authMiddleware, todoController.shareTodoList);
router.get('/shared-with', authMiddleware, todoController.getSharedWith);
router.get('/accessible-lists', authMiddleware, todoController.getAccessibleLists);
router.get('/shared/:ownerEmail', authMiddleware, todoController.getTodoListForSharedUser);
router.delete('/:todoId', authMiddleware, todoController.deleteTodo);
router.put('/:todoId', authMiddleware, todoController.updateTodo);
router.post('/unshare', authMiddleware, todoController.unshare);

module.exports = router;
