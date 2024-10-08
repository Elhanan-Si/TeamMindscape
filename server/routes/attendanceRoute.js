const express = require("express");
const router = express.Router();

const { startAttendance, endAttendance } = require("../controllers/attendanceController");

router.post('/start', startAttendance);
router.post('/end', endAttendance);


module.exports = router;
