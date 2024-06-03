const Groups = require('../models/groups.model');

const getMyGroups = async (req, res) => {
    const userId = req.params.user_id;

    try {
        const [groups] = await Groups.selectGroupsByUserId(userId);
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los grupos del usuario" });
    }
}

const createGroup = async (req, res) => {
    const { title, description } = req.body;
    try {
        await Groups.insertGroup({ title, description });
        res.status(201).json({ message: 'Grupo creado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: "Error al crear el grupo" });
    }
}

const updateGroup = async (req, res) => {
    const groupId = req.params.group_id;
    const { title, description, notification } = req.body;
    try {
        await Groups.updateGroup(groupId, { title, description, notification });
        res.status(200).json({ message: 'Grupo actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el grupo" });
    }
}

const deleteGroup = async (req, res) => {
    const groupId = req.params.group_id;
    try {
        await Groups.deleteGroup(groupId);
        res.status(200).json({ message: 'Grupo eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el grupo" });
    }
}

module.exports = {
    getMyGroups,
    createGroup,
    updateGroup,
    deleteGroup
}