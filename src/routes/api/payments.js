const router = require('express').Router();
const { checkAdmin } = require('../../helpers/middlewares');


const { getPayments, createPayment, deletePayment, updatePayment, getPaymentById, getPaymentsByUserId, getPaymentsWhereUserId } = require('../../controllers/payments.controller');

router.get('/:group_id/', getPayments);
router.get('/:group_id/:payment_id', getPaymentById);
router.get('/user/:user_id/paid', getPaymentsByUserId);
router.get('/user/:user_id/participated', getPaymentsWhereUserId); 
router.post('/:group_id/create', checkAdmin, createPayment);
router.put('/:group_id/:payment_id', checkAdmin, updatePayment);
router.delete('/:group_id/:payment_id', checkAdmin, deletePayment );

module.exports = router;
