const router = require('express').Router();
const { checkAdmin } = require('../../helpers/middlewares');

const { getMyGroups, updateGroup, createGroup, deleteGroup, getGroupById } = require('../../controllers/groups.controllers')

router.get('/:user_id', getMyGroups);
router.get('/group/:group_id', getGroupById);
router.post('/create', createGroup);
router.put('/update/:group_id', checkAdmin, updateGroup)
router.delete('/delete/:group_id', checkAdmin, deleteGroup)



module.exports = router;