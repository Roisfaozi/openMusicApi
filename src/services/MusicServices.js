const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const { mapDBToModel } = require('../utils')
const InvariantError = require('../exeptions/InvariantError')
const NotFoundError = require('../exeptions/NotfoundError')

class MusicService {
  constructor () {
    this.pool = new Pool()
  }

  async addMusic (title, year, performer, genre, duration) {
    const id = nanoid(16)
    const insertedAt = new Date().toISOString
    const updatedAt = insertedAt

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      values: [
        id,
        title,
        year,
        performer,
        genre,
        duration,
        insertedAt,
        updatedAt,
      ],
    }

    const result = await this.pool.query(query)

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getMusic () {
    const result = await this.pool.query(
      'SELECT id, title, performer FROM songs'
    )
    return result.rows
  }

  async getMusicById (id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    }
    const result = await this.pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan')
    }

    return result.rows.map(mapDBToModel)[0]
  }

  async editMusicById (id, title, year, performer, genre, duration) {
    const updatedAt = new Date().toISOString()

    // generate fields and values will be update
    let fields = 'title = $1, year = $2, performer = $3, updated_at = $4'
    const values = [title, year, performer, updatedAt]

    // if genre is exists
    if (genre) {
      fields += ', genre = $5'
      values.push(genre)
    }

    // if duration exists
    if (duration) {
      fields += ', duration = $6'
      values.push(duration)
    }

    // add id to values array
    values.push(id)

    const query = {
      text: `UPDATE songs SET ${fields} WHERE id = $${values.length} RETURNING id`,
      values,
    }
    const result = await this.pool.query(query)

    // if not success edit
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan')
    }
  }

  async deleteMusicById (id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    }
    const result = await this.pool.query(query)

    // if not success delete
    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan')
    }
  }

  async verifySongIsExist (songId) {
    const query = {
      text: 'SELECT COUNT(1) FROM songs WHERE id = $1',
      values: [songId],
    }
    const result = await this._pool.query(query)
    if (!result) {
      throw new NotFoundError('Lagu yang dicari tidak ditemukan')
    }
  }
}

module.exports = MusicService
