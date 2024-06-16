const selectAll = () => {
    return db.query('SELECT * FROM users');
}

const selectById = (userId) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    return db.query(query, [userId]);
}

const selectByEmail = (email) => {
    const query = 'SELECT id, password FROM users WHERE email = ?';
    return db.query(query, [email]);
};

const selectByPhone = (phone) => {
    const query = 'SELECT * FROM users WHERE phone = ?';
    return db.query(query, [phone]);
}

const selectUserByEmailOrUsername = async (emailOrUsername) => {
    try {
        const query = 'SELECT id FROM users WHERE email = ? OR username = ?';
        const [rows] = await db.query(query, [emailOrUsername, emailOrUsername]);
        return rows;
    } catch (error) {
        throw error;
    }
};


const insert = ({ name, email, username, password, phone }) => {
    const query = 'INSERT INTO users (name, email, username, password, phone) VALUES (?, ?, ?, ?, ?)';
    return db.query(query, [name, email, username, password, phone]);
}

const updateUserById = (userId, { name, email, password, phone }) => {
    const query = 'UPDATE users SET name = ?, email = ?, username = ?, password = ?, phone = ? WHERE id = ?';
    return db.query(query, [name, email, username, password, phone, userId]);
}

const deleteUserById = (userId) => {
    const query = 'DELETE FROM users WHERE id = ?';
    return db.query(query, [userId]);
}

module.exports = {
    selectAll,
    selectById,
    selectByEmail,
    selectByPhone,
    selectUserByEmailOrUsername,
    insert,
    updateUserById,
    deleteUserById
};

