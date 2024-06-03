const router = require('express').Router();

const { addMember, deleteMember } = require('../../controllers/members.controllers')

router.post('/:user_id', addMember);
router.delete('/delete/:group_id/:user_id', deleteMember);



module.exports = router;