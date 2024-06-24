const Payments = require('../models/payments.model');
const Debts = require('../models/debts.model');
const Groups = require ('../models/groups.model')
const { sendMail } = require('../helpers/nodemailer');

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
    const { amount, description, paid_by, participants } = req.body;
    const groupId = req.params.group_id;

    try {
        const [paymentResult] = await Payments.createPayment(amount, description, paid_by, groupId);
        const paymentId = paymentResult.insertId;

        const numberOfParticipants = participants.length + 1; 
        const shareAmount = amount / numberOfParticipants;

        // Añadir los participantes del pago (incluido el pagador)
        const allParticipants = participants.map(participant => ({
            userId: participant.userId,
            amount: shareAmount
        }));
        allParticipants.push({ userId: paid_by, amount: shareAmount });

        await Payments.addPaymentParticipants(paymentId, allParticipants);

        for (const participant of allParticipants) {
            const { userId, amount: participantAmount } = participant;
            await Debts.updateDebt(groupId, userId, -participantAmount); // Restar la parte del pago a los participantes
            await Debts.updateDebt(groupId, paid_by, participantAmount); // Sumar la parte del pago al pagador
        }
        const [groupRows] = await Groups.selectGroupById(groupId);
        const group = groupRows[0];
        const groupTitle = group.title;

        // Obtener los correos electrónicos de los participantes
        const [members] = await Payments.getGroupMembersEmails(groupId);

        // Construir los detalles del correo electrónico
        const to = members.map(member => member.email).join(',');
        const subject = `Nuevo pago creado en el grupo ${groupTitle}`;
        const text = `Se ha creado un nuevo pago de ${amount} € con la descripción: ${description}`;
        const html = `<p>Se ha creado un nuevo pago de <b>${amount}</b> € con la descripción: <b>${description}</b></p>`;

        // Enviar el correo electrónico
        await sendMail(to, subject, text, html);

        res.status(201).json({ message: 'Pago creado exitosamente y correos electrónicos enviados', paymentId });
    } catch (error) {
        console.error('Error creando el pago:', error);
        res.status(500).json({ message: 'Error al crear el pago' });
    }
};

const updatePayment = async (req, res) => {
    const paymentId = req.params.payment_id;
    const { amount, description, paid_by, participants } = req.body;

    try {
        // Obtener los detalles del pago actual
        const [[currentPayment]] = await Payments.getPaymentById(paymentId);
        if (!currentPayment) {
            return res.status(404).json({ message: 'Pago no encontrado' });
        }

        const [currentParticipants] = await Payments.getPaymentParticipants(paymentId);
        const groupId = req.params.group_id;

        // Revertir las deudas de los participantes actuales
        for (const participant of currentParticipants) {
            const { user_id: userId, amount: participantAmount } = participant;
            await Debts.updateDebt(groupId, userId, participantAmount); // Sumar nuevamente la parte del pago a los participantes actuales
            await Debts.updateDebt(groupId, currentPayment.paid_by, -participantAmount); // Restar nuevamente la parte del pago al pagador actual
        }

        // Actualizar el pago
        await Payments.updatePaymentById(paymentId, amount, description, paid_by);

        // Calcular la cantidad que cada participante debe
        const numberOfParticipants = participants.length + 1; // Incluir al pagador
        const shareAmount = amount / numberOfParticipants;

        // Actualizar los participantes del pago (incluido el pagador)
        const allParticipants = participants.map(participant => ({
            userId: participant.userId,
            amount: shareAmount
        }));
        allParticipants.push({ userId: paid_by, amount: shareAmount });

        await Payments.updatePaymentParticipants(paymentId, allParticipants);

        // Calcular y actualizar las nuevas deudas
        for (const participant of allParticipants) {
            const { userId, amount: participantAmount } = participant;
            await Debts.updateDebt(groupId, userId, -participantAmount); // Restar la parte del pago a los nuevos participantes
            await Debts.updateDebt(groupId, paid_by, participantAmount); // Sumar la parte del pago al pagador actual
        }

        res.status(200).json({ message: 'Pago actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar el pago:', error);
        res.status(500).json({ message: 'Error al actualizar el pago', error: error.message });
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


module.exports = {
    getPayments,
    getPaymentById,
    getPaymentsByUserId,
    getPaymentsWhereUserId,
    createPayment,
    updatePayment,
    deletePayment
};




