const express = require('express');
const router = express.Router();

const { getTasksCompletedStatistics, getWorkHoursStatistics, getEmployeeTaskStatistics, getEmployeeWorkHoursStatistics } = require('../controllers/statisticsController');


router.get('/getTasksCompletedStatistics', getTasksCompletedStatistics);
router.get('/getWorkHoursStatistics', getWorkHoursStatistics);
router.get('/getEmployeeTaskStatistics/:employeeId', getEmployeeTaskStatistics);
router.get('/getEmployeeWorkHoursStatistics/:employeeId', getEmployeeWorkHoursStatistics);


module.exports = router;