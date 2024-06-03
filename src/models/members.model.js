const insertMember = async (groupId, userId) => {  
    const [admins] = await db.query('SELECT * FROM members WHERE groups_id = ? AND role = "admin"', [groupId]);

    let role = 'normal'; 
    if (admins.length === 0) {
        role = 'admin'; 
    }

    const query = 'INSERT INTO members (groups_id, users_id, role) VALUES (?, ?, ?)';
    return db.query(query, [groupId, userId, role]);
}

const deleteMemberById = async (groupId, userId) => {
    const query = 'DELETE FROM members WHERE groups_id = ? AND users_id = ?';
    return db.query(query, [groupId, userId]);
}


module.exports = {
    insertMember,
    deleteMemberById
};
