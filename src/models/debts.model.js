const getDebtsByUserId = async (groupId, userId) => {
    const query = 'SELECT * FROM debts WHERE members_groups_id = ? AND members_users_id = ?';
    return db.query(query, [groupId, userId]);
};

const insertDebt = (groupId, userId, balance) => {
  const query = 'INSERT INTO debts (balance, members_groups_id, members_users_id) VALUES (?, ?, ?)';
  db.query(query, [balance, groupId, userId]);
};
  
const updateDebt = async (groupId, userId, amount) => {
    const query = `
        UPDATE debts
        SET balance = balance + ?
        WHERE members_groups_id = ? AND members_users_id = ?
    `;
    return db.query(query, [amount, groupId, userId]);
};

module.exports = {
  getDebtsByUserId,
  insertDebt,
  updateDebt
};



