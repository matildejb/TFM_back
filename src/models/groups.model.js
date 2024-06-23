const selectAll = () => {
    return db.query('SELECT * FROM groups');
}

const selectGroupsByUserId = (userId) => {
    const query = `
        SELECT g.id, g.title, g.description, g.notification
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

const insertGroup = ({ title, description, notification }) => {
    const query = 'INSERT INTO `groups` (title, description) VALUES (?, ?)';
    return db.query(query, [title, description]);
}

const updateGroup = (groupId, { title, description, notification }) => {
    const query = 'UPDATE `groups` SET title = ?, description = ?, notification = ? WHERE id = ?';
    return db.query(query, [title, description, notification, groupId]);
}

const deleteGroup = (groupId) => {
    const query = 'DELETE FROM `groups` WHERE id = ?';
    return db.query(query, [groupId]);
}

module.exports = {
    selectAll,
    selectGroupsByUserId,
    selectGroupById,
    insertGroup,
    updateGroup,
    deleteGroup
}