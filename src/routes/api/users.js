const router = require('express').Router();
const { checkToken } = require('../../helpers/middlewares');
const upload = require('../../helpers/upload'); 

const {getAllUsers, deleteUser, updateUser, register, login, getProfile, getUserById, updateProfileImage } = require('../../controllers/users.controllers')

router.get('/userList', checkToken, getAllUsers);
router.get('/profile', checkToken, getProfile);
router.get('/:user_id', checkToken, getUserById);
router.post('/register', register);
router.post('/login', login);
router.put('/profile/update/:user_id', checkToken, updateUser);
router.put('/profile/image/:user_id', checkToken, upload.single('profile_image'), updateProfileImage);
router.delete('/profile/delete/:user_id', checkToken, deleteUser);

module.exports = router;