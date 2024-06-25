const selectAll = () => {
    return db.query('SELECT * FROM groups');
}

const selectGroupsByUserId = (userId) => {
    const query = `
        SELECT g.id, g.title, g.description
        FROM \`groups\` g
        INNER JOIN members m ON m.groups_id = g.id
        WHERE m.users_id = ?;
    `;
    return db.query(query, [userId]);
}

const selectGroupById = (groupId) => {
    const query = 'SELECT id, title, description FROM \`groups\` WHERE id = ?';
    return db.query(query, [groupId]);
};

const insertGroup = ({ title, description }) => {
    const query = 'INSERT INTO `groups` (title, description) VALUES (?, ?)';
    return db.query(query, [title, description]);
}

const updateGroup = (groupId, { title, description }) => {
    const query = 'UPDATE `groups` SET title = ?, description = ? WHERE id = ?';
    return db.query(query, [title, description, groupId]);
}

const deleteGroupDebts = async (groupId) => {
    const query = `
        DELETE d FROM debts d
        INNER JOIN members m ON d.members_groups_id = m.groups_id AND d.members_users_id = m.users_id
        WHERE m.groups_id = ?;
    `;
    try {
        const [result] = await db.query(query, [groupId]);
        return result;
    } catch (error) {
        console.error('Error al eliminar las deudas del grupo:', error);
        throw error;
    }
};

const deleteGroupMembers = async (groupId) => {
    const query = 'DELETE FROM `members` WHERE groups_id = ?';
    try {
        const [result] = await db.query(query, [groupId]);
        return result;
    } catch (error) {
        console.error('Error al eliminar los miembros del grupo:', error);
        throw error;
    }
}

const deleteGroup = async (groupId) => {
    const query = 'DELETE FROM `groups` WHERE id = ?';
    try {
        const [result] = await db.query(query, [groupId]);
        return result;
    } catch (error) {
        console.error('Error al ejecutar la consulta DELETE:', error);
        throw error;
    }
}

module.exports = {
    selectAll,
    selectGroupsByUserId,
    selectGroupById,
    insertGroup,
    updateGroup,
    deleteGroupDebts,
    deleteGroupMembers,
    deleteGroup
}