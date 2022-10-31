/* eslint-disable camelcase */

// exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('albums', { cover: { type: 'text', notNull: false } });
};

exports.down = pgm => {
    pgm.dropColumns('albums', { cover: { type: 'text', notNull: false } });
};
