const Debts = require('../models/debts.model');

const getDebtsById = async (req, res) => {
    const userId = req.params.user_id;
    const groupId = req.params.group_id; 

    try {
        const [debts] = await Debts.getDebtsByUserId(groupId, userId);
        res.status(200).json(debts);
    } catch (error) {
        console.error('Error al obtener las deudas:', error);
        res.status(500).json({ message: 'Error al obtener las deudas' });
    }
};

async function getTotalDebtsByGroupAndUserId(req, res) {
    try {
        const group_id = req.params.group_id;
        const user_id = req.params.user_id;
        const totalDebts = await getTotalDebtsForGroupAndUser(group_id, user_id);
        res.status(200).json(totalDebts);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las deudas' });
    }
}       

module.exports = {
    getDebtsById
};





