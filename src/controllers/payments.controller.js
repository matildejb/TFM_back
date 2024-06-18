const Payments = require('../models/payments.model');
const Debts = require('../models/debts.model');

const getPayments = async (req, res) => {
    const groupId = req.params.group_id;
    try {
        const [payments] = await Payments.getAllByGroupId(groupId);
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los pagos' });
    }
};

const getPaymentById = async (req, res) => {
    const paymentId = req.params.payment_id;

    try {
        const [[payment]] = await Payments.getPaymentById(paymentId);

        if (!payment) {
            return res.status(404).json({ message: 'Pago no encontrado' });
        }

        const [participants] = await Payments.getPaymentParticipants(paymentId);

        res.status(200).json({
            payment,
            participants
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el pago' });
    }
};

const getPaymentsByUserId = async (req, res) => {
    const userId = req.params.user_id;

    try {
        const [payments] = await Payments.getPaymentsByUserId(userId);

        if (payments.length === 0) {
            return res.status(404).json({ message: 'No se encontraron pagos realizados por este usuario' });
        }

        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los pagos' });
    }
};

const getPaymentsWhereUserId = async (req, res) => {
    const userId = req.params.user_id;

    try {
        const [payments] = await Payments.getPaymentsWhereUserId(userId);

        if (payments.length === 0) {
            return res.status(404).json({ message: 'No se encontraron pagos en los que haya participado este usuario' });
        }

        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los pagos' });
    }
};



const createPayment = async (req, res) => {
    const { amount, description, participants } = req.body;
    const payerId = req.user.id;
    const groupId = req.params.group_id;

    try {
        const [paymentResult] = await Payments.createPayment(amount, description, payerId, groupId);
        const paymentId = paymentResult.insertId;

        const numberOfParticipants = participants.length + 1; 
        const shareAmount = amount / numberOfParticipants;

        // Añadir los participantes del pago (incluido el pagador)
        const allParticipants = participants.map(participant => ({
            userId: participant.userId,
            amount: shareAmount
        }));
        allParticipants.push({ userId: payerId, amount: shareAmount });

        await Payments.addPaymentParticipants(paymentId, allParticipants);

        for (const participant of allParticipants) {
            const { userId, amount: participantAmount } = participant;
            await Debts.updateDebt(groupId, userId, -participantAmount); // Restar la parte del pago a los participantes
            await Debts.updateDebt(groupId, payerId, participantAmount); // Sumar la parte del pago al pagador
        }

        res.status(201).json({ message: 'Pago creado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el pago' });
    }
};

const deletePayment = async (req, res) => {
    const paymentId = req.params.payment_id;

    try {
        await Payments.deletePaymentById(paymentId);
        res.status(200).json({ message: 'Pago eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el pago' });
    }
};

const updatePayment = async (req, res) => {
    const paymentId = req.params.payment_id;
    const { amount, description, participants } = req.body;

    try {
        // Obtener los detalles del pago actual
        const [currentPayment] = await Payments.getPaymentById(paymentId);
        const [currentParticipants] = await Payments.getPaymentParticipants(paymentId);

        const payerId = req.user.id;
        const groupId = req.params.group_id;

        // Revertir las deudas de los participantes actuales
        for (const participant of currentParticipants) {
            const { user_id: userId, amount: participantAmount } = participant;
            await Debts.updateDebt(groupId, userId, participantAmount); // Sumar nuevamente la parte del pago a los participantes actuales
            await Debts.updateDebt(groupId, payerId, -participantAmount); // Restar nuevamente la parte del pago al pagador actual
        }

        // Actualizar el pago
        await Payments.updatePaymentById(paymentId, amount, description);

        // Calcular la cantidad que cada participante debe
        const numberOfParticipants = participants.length + 1; // Incluir al pagador
        const shareAmount = amount / numberOfParticipants;

        // Actualizar los participantes del pago (incluido el pagador)
        const allParticipants = participants.map(participant => ({
            userId: participant.userId,
            amount: shareAmount
        }));
        allParticipants.push({ userId: req.user.id, amount: shareAmount });

        await Payments.updatePaymentParticipants(paymentId, allParticipants);

        // Calcular y actualizar las nuevas deudas
        for (const participant of allParticipants) {
            const { userId, amount: participantAmount } = participant;
            await Debts.updateDebt(groupId, userId, -participantAmount); // Restar la parte del pago a los nuevos participantes
            await Debts.updateDebt(groupId, req.user.id, participantAmount); // Sumar la parte del pago al pagador actual
        }

        res.status(200).json({ message: 'Pago actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el pago' });
    }
};

module.exports = {
    getPayments,
    getPaymentById,
    getPaymentsByUserId,
    getPaymentsWhereUserId,
    createPayment,
    deletePayment,
    updatePayment
};




