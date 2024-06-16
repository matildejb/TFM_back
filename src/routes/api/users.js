const router = require('express').Router();
const { checkToken } = require('../../helpers/middlewares');

const {getAllUsers, deleteUser, updateUser, register, login, getUserById, getPerfil } = require('../../controllers/users.controllers')

router.get('/userList', checkToken, getAllUsers);
router.get('/profile', checkToken, getUserById);
router.get('/perfil', checkToken, getPerfil);
router.post('/register', register);
router.post('/login', login);
router.put('/profile/update', checkToken, updateUser);
router.delete('/profile/delete/:user_id', checkToken, deleteUser);

module.exports = router;