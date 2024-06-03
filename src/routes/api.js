const router = require('express').Router();


router.use('/groups', require('./api/groups'));
router.use('/users', require('./api/users'));


module.exports = router;