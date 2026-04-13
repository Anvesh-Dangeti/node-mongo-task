const express = require("express");
const authMiddleware = require("../middlewear/auth.middlewear.js");
const taskController = require("../controllers/task.controller.js");

const router = express.Router();

router.post('/create', authMiddleware, taskController.createTask);
router.get('/fetch', authMiddleware, taskController.getTasks);
router.patch('/update/:id', authMiddleware, taskController.updateTask);
router.delete('/delete/:id', authMiddleware, taskController.deleteTask);


module.exports = router;