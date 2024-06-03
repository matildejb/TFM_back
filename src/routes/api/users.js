const router = require('express').Router();

const {getAllUsers, createUser, deleteUser, updateUser } = require('../../controllers/users.controllers')

router.get('/userList', getAllUsers)
router.post('../register', createUser)
router.delete('/profile', updateUser)
router.delete('/profile', deleteUser)

module.exports = router;