const { selectByEmail } = require('./users.model');

const selectAll = (groupId) => {
    const query = `
        SELECT u.id, u.name, u.email
        FROM members m
        JOIN users u ON m.users_id = u.id
        WHERE m.groups_id = ?;
    `;
    return db.query(query, [groupId]);
};

const selectMembersByGroupId = (groupId) => {
    const query = `
        SELECT u.id AS user_id, u.name, u.email
        FROM members m
        JOIN users u ON m.users_id = u.id
        WHERE m.groups_id = ?;
    `;
    return db.query(query, [groupId]);
};

const selectMembersInMyGroups = async (userId) => {
    const query = `
        SELECT DISTINCT u.username, u.email
        FROM members m
        JOIN users u ON m.users_id = u.id
        WHERE m.groups_id IN (
            SELECT groups_id
            FROM members
            WHERE users_id = ?
        )
        AND u.id != ?  -- Excluye al propio usuario de la lista
    `;
    return db.query(query, [userId, userId]);
};

const insertAdminById = async (groupId, userId, role) => {
    const query = 'INSERT INTO members (groups_id, users_id, role) VALUES (?, ?, ?)';
    return db.query(query, [groupId, userId, role]);
};

const insertMemberByEmail = async (groupId, userEmail) => {
    const [users] = await selectByEmail(userEmail);
    if (users.length === 0) {
        throw new Error('Usuario no encontrado');
    }
    const userId = users[0].id;

    const query = 'INSERT INTO members (groups_id, users_id) VALUES (?, ?)';
    return db.query(query, [groupId, userId]);
};

const insertMemberById = async (groupId, userId) => {
    const query = 'INSERT INTO members (groups_id, users_id) VALUES (?, ?)';
    return db.query(query, [groupId, userId]);
};


const deleteMemberById = async (groupId, userId) => {
    const deleteDebtsQuery = 'DELETE FROM debts WHERE members_groups_id = ? AND members_users_id = ?';
    await db.query(deleteDebtsQuery, [groupId, userId]);

    const deleteMemberQuery = 'DELETE FROM members WHERE groups_id = ? AND users_id = ?';
    return db.query(deleteMemberQuery, [groupId, userId]);
}

const checkIfAdmin = (groupId, userId) => {
    const query = 'SELECT * FROM members WHERE groups_id = ? AND users_id = ? AND role = "admin"';
    return db.query(query, [groupId, userId]);
};


module.exports = {
    selectAll,
    selectMembersByGroupId,
    selectMembersInMyGroups,
    insertAdminById,
    insertMemberByEmail,
    insertMemberById,
    deleteMemberById,
    checkIfAdmin
};
