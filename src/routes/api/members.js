const router = require('express').Router();

const { addMember, deleteMember, getAllMembers, getMembersInMyGroups } = require('../../controllers/members.controllers');
const { checkAdmin } = require('../../helpers/middlewares');


router.get('/:group_id', getAllMembers);
router.get('/:user_id/known', getMembersInMyGroups)
router.post('/:group_id/add', checkAdmin, addMember);
router.delete('/:group_id/:user_id', checkAdmin, deleteMember);


module.exports = router;