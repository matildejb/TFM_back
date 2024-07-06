const bcrypt = require('bcryptjs');

const Users = require('../models/users.model');
const { createToken } = require('../helpers/utils');
const { sendMail } = require('../helpers/nodemailer');

const getAllUsers = async (req, res) => {
    try {
        const [users] = await Users.selectAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error al recibir los usuarios" });
    }
}

const getUserById = async (req, res) => {
  try {
      const userId = req.params.user_id
      const [user] = await Users.selectById(userId)
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const getUserEmail = async (req, res) => {
    const userId = req.params.user_id;
    try {
        const [user] = await Users.selectEmail(userId);
        if (user.length === 0) {
            return res.status(404).json({ message: 'Email no encontrado' });
        }
        res.status(200).json(user[0]);
    } catch (error) {
        console.error('Error al recibir el email:', error);
        res.status(500).json({ message: 'Error al recibir el email' });
    }
};

const getPhoto = async (req, res) => {
    const userId = req.params.user_id;
    try {
        const [user] = await Users.selectPhoto(userId);
        if (user.length === 0 || !user[0].profile_image) {
            return res.status(404).json({ message: 'Foto no encontrada' });
        }
           res.status(200).json({ profile_image: user[0].profile_image });
    } catch (error) {
        console.error('Error al recibir la foto:', error);
        res.status(500).json({ message: 'Error al recibir la foto' });
    }
}; 

const getProfile = (req, res) => {
    res.json(req.user);
}

const getUserDebts = async (req, res) => {
    try {
        const userId = req.params.user_id;
        const [debts] = await Users.selectUserDebts(userId);

        if (debts.length === 0) {
            return res.status(404).json({ message: "No se encontraron deudas para este usuario" });
        }

        res.status(200).json(debts);
    } catch (error) {
        console.error("Error al obtener las deudas del usuario:", error);
        res.status(500).json({ message: "Error del servidor al obtener las deudas" });
    }
};

const updateUser = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const { name, email, username, phone, password } = req.body;
 
    const updateData = { name, email, username, phone, password };
    updateData.password = bcrypt.hashSync(updateData.password, 9);
 
    const [result] = await Users.updateUserById(user_id, updateData);
 
    if (result.affectedRows === 1) {
      const [[user]] = await Users.selectById(user_id);
      res.json(user);
    } else {
      res.status(400).json({ error: "Error al actualizar el usuario" });
    }
  } catch (err) {
    console.error("Error updating user:", err);
    next(err);
  }
};

const updateProfileImage = async (req, res) => {
    const userId = req.user.id;
    const profileImage = req.file ? req.file.filename : null;

    if (!profileImage) {
        return res.status(400).json({ error: 'No se ha subido ninguna imagen' });
    }

    // Construir la URL de la imagen
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${profileImage}`;

    try {
        await Users.updateProfileImage(userId, imageUrl);
        res.status(200).json({ message: 'Imagen de perfil actualizada correctamente', profileImage: imageUrl });
    } catch (error) {
        console.error('Error al actualizar la imagen de perfil:', error);
        res.status(500).json({ error: 'Error al actualizar la imagen de perfil' });
    }
};

const deleteUser = async (req, res) => {
    const userId = req.params.user_id;
    try {
        await Users.deleteUserById(userId);
        res.status(200).json({ message: 'Se ha eliminado el usuario correctamente' });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar al usuario" });
    }
}

const register = async (req, res, next) => {
    req.body.password = bcrypt.hashSync(req.body.password, 9);

    try {
        const [result] = await Users.insert(req.body);
        const userId = result.insertId

        const [usersRows] = await Users.selectEmail(userId) 
        if (usersRows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = usersRows[0];         
        const userEmail = user.email;

        const to = userEmail;
        const subject = `¡Bienvenido a SharExpen! ${userEmail}`;
        const text = `Bienvenido a la aplicación ShareExpen`;
        const html = `<p>Inicia sesion ahora en SharExpen y disfruta de sus funciones`;

        await sendMail(to, subject, text, html);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
}

const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const [users] = await Users.selectByEmail(email);

        if (users.length === 0) {
            return res.status(401).json({
                error: 'Error en email y/o password'
            });
        }

        const user = users[0];

        if (!user.password) {
            console.error('Password is undefined or null for user:', user);
            return res.status(500).json({
                error: 'Error interno del servidor. Por favor, contacte al administrador.'
            });
        }

        const check = bcrypt.compareSync(password, user.password);

        if (!check) {
            return res.status(401).json({
                error: 'Error en email y/o password'
            });
        }

        res.json({
            message: 'Login correcto',
            token: createToken(user)
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            error: 'Error al iniciar sesión'
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    getUserEmail,
    getPhoto,
    getProfile,
    getUserDebts,
    updateUser,
    updateProfileImage,
    deleteUser,
    register,
    login
}