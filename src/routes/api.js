const { checkToken } = require('../helpers/middlewares');

const router = require('express').Router();


router.use('/groups', checkToken, require('./api/groups'));
router.use('/users', require('./api/users'));
router.use('/members', checkToken, require('./api/members'));
router.use('/payments', checkToken, require('./api/payments'));
router.use('/debts', checkToken, require('./api/debts'));


module.exports = router;