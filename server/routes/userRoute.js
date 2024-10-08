const express = require('express');
const router = express.Router();

const { getUserProfile, getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');


router.get('/getUserProfile', getUserProfile);
router.get('/getUsers', getUsers);
router.post('/createUser', createUser);
router.put('/updateUser/:userId', updateUser);
router.delete('/deleteUser/:userId', deleteUser);

module.exports = router;