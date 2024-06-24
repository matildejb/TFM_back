const jwt = require('jsonwebtoken');
const User = require('../models/users.model');
const Members = require('../models/members.model');

const checkToken = async (req, res, next) => {
    if (!req.headers['authorization']) {
        return res.status(403).json({ error: 'Debes incluir el token de autorizacion' });
    }

    const token = req.headers['authorization'];
    let payload;
    try {
        payload = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
        return res.status(403).json({ error: 'Token invalido o expirado' });
    }

    const [result] = await User.selectById(payload.user_id);
    req.user = result[0];

    next();
}

const checkAdmin = async (req, res, next) => {
    const groupId = req.params.group_id;
    const userId = req.user.id;

    const [adminCheck] = await Members.checkIfAdmin(groupId, userId);
    if (adminCheck.length === 0) {
        return res.status(403).json({ error: 'Debes ser administrador del grupo' });
    }
    next();
};


module.exports = {
    checkToken,
    checkAdmin,
}
