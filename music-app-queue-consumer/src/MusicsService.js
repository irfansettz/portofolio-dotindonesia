const {
    Pool
} = require("pg/lib");

class MusicsServices {
    constructor() {
        this._pool = new Pool;
    }

    async getNotes(playlistId, userId) {
        const query = {
            text: 'select * from playlists where id=$1 and owner=$2',
            values: [playlistId,userId],
        };
        const result = await this._pool.query(query);

        const query2 = {
            text: 'select id, title, performer from songs where id in (select song_id from playlist_songs where playlist_id = $1)',
            values: [playlistId]
        }
        const result2 = await this._pool.query(query2);
        return [result.rows[0], result2.rows];
    }
}

module.exports = MusicsServices;