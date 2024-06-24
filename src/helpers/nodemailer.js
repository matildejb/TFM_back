const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, 
    auth: {
        user: 'sharexpen@gmail.com', 
        pass: 'ozgh bbbh puxa zujz' 
    }
});

const sendMail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: '"ShareExpen" <shareexpen@gmail.com>', 
            to, 
            subject, 
            text, 
            html 
        });
        console.log('Mensaje enviado: %s', info.messageId);
    } catch (error) {
        console.error('Error al enviar el correo: %s', error);
    }
};

module.exports = { sendMail };