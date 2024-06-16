const router = require('express').Router();
const { checkToken } = require('../../helpers/middlewares');
const { getDebtsById } = require('../../controllers/debts.controllers');

router.get('/:group_id/:user_id/', checkToken, getDebtsById);

module.exports = router;
