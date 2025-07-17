const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'vominhkha0603@gmail.com',
        pass: 'hkgjnptcztyarhzs' 
    }
});

const sendMail = async (to, subject, text) => {
    const mailOptions = {
        from: "vominhkha0603@gmail.com",
        to,
        subject,
        text
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendMail };