const Users = require('../models/users.model');

const getAllUsers = async (req, res) => {
    try {
        const [users] = await Users.selectAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error al recibir los usuarios" });
    }
}

const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        await Users.insertUser({ name, email, password });
        res.status(201).json({ message: 'Exito en la creacion del usuario' });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el usuario" });
    }
}

const updateUser = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const [result] = await Users.updateUser(user_id, req.body);
        if (result.changedRows === 1) {            
            const [[user]] = await Users.selectById(user_id);    
            res.json(user);
        } else {
            res.status(400).json({ error: 'Error al actualizar el usuario' });
        }  
    } catch (err) {
        next(err);
    }
}


const deleteUser = async (req, res) => {
    const userId = req.params.user_id;
    try {
        await Users.deleteUserById(userId);
        res.status(200).json({ message: 'Se ha eliminado el usuairo correctamente' });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar al usuario" });
    }
}


module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
}