const nodemailer = require('nodemailer');

class MailSender {
    constructor() {
        this._transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                user: process.env.MAIL_ADDRESS,
                pass: process.env.MAIL_PASSWORD,
            },
        });
    }
    sendEmail(targetEmail, content) {
        const message = {
            from: 'Music Apps',
            to: targetEmail,
            subject: 'Ekspor Musics',
            text: 'Terlampir hasil dari ekspor musics',
            attachments: [{
                filename: 'musics.json',
                content,
            }, ],
        };

        return this._transporter.sendMail(message);
    }
}

module.exports = MailSender;