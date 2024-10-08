const express = require("express");
const router = express.Router();

const { getEmployeeGroup, createEmployeeGroup, updateEmployeeGroup, deleteEmployeeGroup } = require("../controllers/employeeGroupsController");

router.get('/employeeGroups/:id', getEmployeeGroup);
router.post('/employeeGroup/new', createEmployeeGroup);
router.post('/employeeGroup/update', updateEmployeeGroup);
router.delete('/employeeGroup/delete/:id', deleteEmployeeGroup);

module.exports = router;
