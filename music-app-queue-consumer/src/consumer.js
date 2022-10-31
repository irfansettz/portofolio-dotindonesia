require('dotenv').config();
const amqp = require('amqplib');
const MusicsService = require('./MusicsService');
const MailSender = require('./MailSender');
const Listener = require('./listener');

const init = async () => {
    const musicsService = new MusicsService();
    const mailSender = new MailSender();
    const listener = new Listener(musicsService, mailSender);

    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();

    await channel.assertQueue('export:musics', {
        durable: true,
    });

    channel.consume('export:musics', listener.listen, { noAck: true });
};
init();