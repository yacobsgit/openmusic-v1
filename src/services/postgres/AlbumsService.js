const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
const { mapDBToModel } = require('../../utils/albumindex')
const NotFoundError = require('../../exceptions/NotFoundError')

class AlbumsService {
  constructor () {
    this._pool = new Pool()
  }

  async addAlbum ({ name, year }) {
    const id = nanoid(16)

    const query = {
      text: 'INSERT INTO Albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year]
    }
    const result = await this._pool.query(query)
    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getAlbums () {
    const result = await this._pool.query('SELECT * FROM Albums')
    return result.rows.map(mapDBToModel)
  }

  async getAlbumById (id) {
    const queryAlbum = {
      text: 'SELECT * FROM Albums WHERE id = $1',
      values: [id]
    }
    const querySong = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM songs WHERE songs."albumId"=$1',
      values: [id]
    }
    const fetchAlbum = await this._pool.query(queryAlbum)
    const fetchSong = await this._pool.query(querySong)

    if (!fetchAlbum.rows.length) {
      throw new NotFoundError('Album tidak ditemukan')
    }
    if (!fetchSong.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan')
    }
    return {
      id: fetchAlbum.rows[0].id,
      name: fetchAlbum.rows[0].name,
      year: fetchAlbum.rows[0].year,
      songs: fetchSong.rows
    }
  }

  async editAlbumById (id, { name, year }) {
    const query = {
      text: 'UPDATE Albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id]
    }

    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui Album. Id tidak ditemukan')
    }
  }

  async deleteAlbumById (id) {
    const query = {
      text: 'DELETE FROM Albums WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan')
    }
  }
}
module.exports = AlbumsService
