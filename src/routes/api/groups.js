const router = require('express').Router();
const { checkAdmin } = require('../../helpers/middlewares');

const { getMyGroups, updateGroup, createGroup, deleteGroup } = require('../../controllers/groups.controllers')

router.get('/:user_id', getMyGroups);
router.post('/create', createGroup)
router.put('/update/:group_id', checkAdmin, updateGroup)
router.delete('/delete/:group_id', deleteGroup)


module.exports = router;