const Members = require('../models/members.model');
const Users = require('../models/users.model');
const Debts = require('../models/debts.model');

const getAllMembers = async (req, res) => {
    const groupId = req.params.group_id;

    try {
        const [members] = await Members.selectAll(groupId);
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: "Error al recuperar los miembros" });
    }
};

const getMembersInMyGroups = async (req, res) => {
    const userId = req.user.id;  

    try {
        const [members] = await Members.selectMembersInMyGroups(userId);
        if (members.length === 0) {
            return res.status(404).json({ message: 'No se encontraron miembros en los grupos del usuario' });
        }
        res.status(200).json(members);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error al obtener los miembros de los grupos del usuario' });
    }
};

const addMember = async (req, res) => {
    const groupId = req.params.group_id;
    const { email } = req.body;

    try {
        const [users] = await Users.selectByEmail(email);
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const userId = users[0].id;
        const [result] = await Members.insertMemberById(groupId, userId);
        
        if (result.affectedRows === 0) {
            return res.status(500).json({ message: 'Error al añadir el usuario al grupo' });
        }

        await Debts.insertDebt(groupId, userId, 0);
        res.status(201).json({ message: 'Usuario añadido al grupo exitosamente' });
    } catch (error) {
        console.error('Error al añadir el usuario al grupo:', error);
        res.status(500).json({ message: 'Error al añadir el usuario al grupo' });
    }
};

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
    getAllMembers,
    getMembersInMyGroups,
    addMember,
    deleteMember
};

