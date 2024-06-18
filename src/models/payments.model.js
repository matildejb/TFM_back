const createPayment = async (amount, description, payerId, groupId) => {
    const query = 'INSERT INTO payments (amount, description, paid_by, members_groups_id, created_at) VALUES (?, ?, ?, ?, NOW())';
    return db.query(query, [amount, description, payerId, groupId]);
};

const addPaymentParticipants = async (paymentId, participants) => {
    const query = 'INSERT INTO payment_participants (payment_id, user_id, amount) VALUES ?';
    const values = participants.map(participant => [paymentId, participant.userId, participant.amount]);
    return db.query(query, [values]);
};

const getAllByGroupId = async (groupId) => {
    const query = 'SELECT * FROM payments WHERE members_groups_id = ?';
    return db.query(query, [groupId]);
};

const getPaymentById = async (paymentId) => {
    const query = 'SELECT * FROM payments WHERE id = ?';
    return db.query(query, [paymentId]);
};

const getPaymentParticipants = async (paymentId) => {
    const query = 'SELECT * FROM payment_participants WHERE payment_id = ?';
    return db.query(query, [paymentId]);
};

const getPaymentsByUserId = async (userId) => {
    const query = 'SELECT * FROM payments WHERE paid_by = ?';
    return db.query(query, [userId]);
};

const getPaymentsWhereUserId = async (userId) => {
    const query = `
        SELECT payments.*, payment_participants.amount as participant_amount
        FROM payments
        JOIN payment_participants ON payments.id = payment_participants.payment_id
        WHERE payment_participants.user_id = ?;
    `;
    return db.query(query, [userId]);
};

const deletePaymentById = async (paymentId) => {
    const query = 'DELETE FROM payments WHERE id = ?';
    return db.query(query, [paymentId]);
};

const updatePaymentById = async (paymentId, amount, description) => {
    const query = 'UPDATE payments SET amount = ?, description = ? WHERE id = ?';
    return db.query(query, [amount, description, paymentId]);
};

const updatePaymentParticipants = async (paymentId, participants) => {
    const deleteQuery = 'DELETE FROM payment_participants WHERE payment_id = ?';
    await db.query(deleteQuery, [paymentId]);

    const insertQuery = 'INSERT INTO payment_participants (payment_id, user_id, amount) VALUES ?';
    const values = participants.map(participant => [paymentId, participant.userId, participant.amount]);
    return db.query(insertQuery, [values]);
};

module.exports = {
    createPayment,
    addPaymentParticipants,
    getAllByGroupId,
    getPaymentById,
    getPaymentParticipants,
    getPaymentsByUserId,
    getPaymentsWhereUserId,
    deletePaymentById,
    updatePaymentById,
    updatePaymentParticipants
};
