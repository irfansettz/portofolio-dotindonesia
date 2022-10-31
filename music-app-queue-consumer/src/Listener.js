class Listener {
    constructor(notesService, mailSender) {
        this._notesService = notesService;
        this._mailSender = mailSender;

        this.listen = this.listen.bind(this);
    }

    async listen(message) {
        try {
            const {
                playlistId,
                userId,
                targetEmail
            } = JSON.parse(message.content.toString());

            const music = await this._notesService.getNotes(playlistId, userId);
            const playlist = music[0];
            playlist['songs'] = music[1];
            const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(music));
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = Listener;