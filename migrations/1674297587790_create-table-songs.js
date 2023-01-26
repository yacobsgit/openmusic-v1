/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    title: {
      type: 'TEXT',
      notNull: true
    },
    year: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    genre: {
      type: 'TEXT',
      notNull: true
    },
    performer: {
      type: 'TEXT',
      notNull: true
    },
    duration: {
      type: 'VARCHAR(50)',
      notNull: false
    },
    albumId: {
      type: 'VARCHAR(50)',
      notNull: false
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('songs')
}
