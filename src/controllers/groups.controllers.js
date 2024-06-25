const Groups = require('../models/groups.model');
const Users = require('../models/users.model');
const Members = require('../models/members.model');
const Debts = require('../models/debts.model');

const getMyGroups = async (req, res) => {
    const userId = req.params.user_id;

    try {
        const [groups] = await Groups.selectGroupsByUserId(userId);
        if (groups.length === 0) {
            return res.status(404).json({ message: "No se encontraron grupos para este usuario" });
        }
        res.status(200).json(groups);
    } catch (error) {
        console.error('Error al obtener los grupos del usuario:', error);
        res.status(500).json({ error: "Error al obtener los grupos del usuario" });
    }
}

const getGroupById = async (req, res) => {
    const groupId = req.params.group_id;

    try {
        const [group] = await Groups.selectGroupById(groupId);
        if (group.length === 0) {
            return res.status(404).json({ message: 'Grupo no encontrado' });
        }
        res.status(200).json(group[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el grupo" });
    }
}

const createGroup = async (req, res) => {
    const { title, description } = req.body;
    const userId = req.user.id;
    try {
        const [groupResult] = await Groups.insertGroup({ title, description });
        const groupId = groupResult.insertId;
        await Members.insertAdminById(groupId, userId, 'admin');
        Debts.insertDebt(groupId, userId, 0);
        res.status(201).json({ message: 'Grupo creado exitosamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al crear el grupo" });
    }
}

const updateGroup = async (req, res) => {
    const groupId = req.params.group_id;
    const { title, description} = req.body;
    try {
        await Groups.updateGroup(groupId, { title, description });
        res.status(200).json({ message: 'Grupo actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el grupo" });
    }
}

const deleteGroup = async (req, res) => {
    const groupId = req.params.group_id;
    try {
        await Groups.deleteGroupDebts(groupId);
        await Groups.deleteGroupMembers(groupId);
        const result = await Groups.deleteGroup(groupId);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Grupo no encontrado' });
        }

        res.status(200).json({ message: 'Grupo eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el grupo:', error);
        res.status(500).json({ error: "Error al eliminar el grupo" });
    }
};


module.exports = {
    getMyGroups,
    getGroupById,
    createGroup,
    updateGroup,
    deleteGroup
}