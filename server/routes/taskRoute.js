const express = require("express");
const router = express.Router();

const { getTasks, getTasksSent, createTask, updateTask, deleteTask, toggleTaskStatus } = require("../controllers/taskController");

router.get('/getTasks', getTasks);
router.get('/getTasksSent', getTasksSent);
router.post('/createTask', createTask);
router.post('/update', updateTask);
router.delete('/delete/:taskId', deleteTask);
router.patch('/toggleStatus/:taskId', toggleTaskStatus);

module.exports = router;
