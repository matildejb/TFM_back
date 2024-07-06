const selectAll = () => {
    return db.query('SELECT * FROM users');
}

const selectById = (userId) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    return db.query(query, [userId]);
}

const selectEmail = (userId) => {
    const query = 'SELECT email FROM users WHERE id = ?'
    return db.query(query, [userId]);
}

const selectPhoto = (userId) => {
    const query = 'SELECT profile_image FROM users WHERE id = ?'
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

const selectUserDebts = (userId) => {
    const query = `
        SELECT p.id, p.amount, pp.user_id, pp.amount, p.members_groups_id FROM payments p LEFT JOIN payment_participants pp ON p.id = pp.payment_id
        WHERE 
            (p.paid_by = ? OR pp.user_id = ?)
            AND pp.amount != 0
    `;
    return db.query(query, [userId, userId]);
};

const insert = ({ name, email, username, password, phone }) => {
    const query = 'INSERT INTO users (name, email, username, password, phone) VALUES (?, ?, ?, ?, ?)';
    return db.query(query, [name, email, username, password, phone]);
}

const updateUserById = (userId, { name, email, username, phone, password }) => {
    const query =
        "UPDATE users SET name = ?, email = ?, username = ?, phone = ?, password = ? WHERE id = ?";
    return db.query(query, [name, email, username, phone, password, userId]);

}

const updateProfileImage = async (userId, profileImage) => {
    const query = 'UPDATE users SET profile_image = ? WHERE id = ?';
    try {
        const result = await db.query(query, [profileImage, userId]);
        return result;
    } catch (error) {
        throw error;
    }
};

const deleteUserById = (userId) => {
    const query = 'DELETE FROM users WHERE id = ?';
    return db.query(query, [userId]);
}


module.exports = {
    selectAll,
    selectById,
    selectByEmail,
    selectEmail,
    selectPhoto,
    selectByPhone,
    selectUserByEmailOrUsername,
    selectUserDebts,
    insert,
    updateUserById,
    updateProfileImage,
    deleteUserById
};

