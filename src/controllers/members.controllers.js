const Members = require('../models/members.model');

const addMember = async (req, res) => {
    const groupId = req.params.group_id;
    const { user_id, role } = req.body;

    try {
        const [result] = await Members.insertMember(groupId, user_id, role);
        res.status(201).json({ result });
    } catch (error) {
        res.status(500).json({ message: "Error al añadir el usuario al grupo" });
    }
}

const deleteMember = async (req, res) => {
    const groupId = req.params.group_id;
    const userId = req.params.user_id;

    try {
        await Members.deleteMemberByIds(groupId, userId);
        res.status(200).json({ message: 'Miembro eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el miembro" });
    }
}

module.exports = {
    addMember,
    deleteMember
};

