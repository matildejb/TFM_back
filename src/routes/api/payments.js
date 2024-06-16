const router = require('express').Router();
const { checkAdmin } = require('../../helpers/middlewares');


const { getPayments, createPayment, deletePayment, updatePayment } = require('../../controllers/payments.controller');

router.get('/:group_id/', getPayments );
router.post('/:group_id/create', checkAdmin, createPayment);
router.put('/:group_id/:payment_id', checkAdmin, updatePayment);
router.delete('/:group_id/:payment_id', checkAdmin, deletePayment );

module.exports = router;
