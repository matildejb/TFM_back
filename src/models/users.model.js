const selectAll = () => {
    return db.query('SELECT * FROM users');
}

const selectById = (userId) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    return db.query(query, [userId]);
}

const insertUser = ({ name, email, password }) => {
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    return db.query(query, [name, email, password]);
}

const updateUser = (userId, { name, email, password }) => {
    const query = 'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?';
    return db.query(query, [name, email, password, userId]);
}

const deleteUserById = (userId) => {
    const query = 'DELETE FROM users WHERE id = ?';
    return db.query(query, [userId]);
}

module.exports = {
    selectAll,
    selectById,
    insertUser,
    updateUser,
    deleteUserById
};

