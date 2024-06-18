const router = require('express').Router();
const { checkToken } = require('../../helpers/middlewares');

const {getAllUsers, deleteUser, updateUser, register, login, getProfile } = require('../../controllers/users.controllers')

router.get('/userList', checkToken, getAllUsers);
router.get('/profile', checkToken, getProfile);
router.post('/register', register);
router.post('/login', login);
router.put('/profile/update/:user_id', checkToken, updateUser);
router.delete('/profile/delete/:user_id', checkToken, deleteUser);

module.exports = router;