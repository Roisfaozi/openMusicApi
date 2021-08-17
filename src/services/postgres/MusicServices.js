const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const { mapDBToModel } = require('../../utils')
const InvariantError = require('../../exeptions/InvariantError')
const NotFoundError = require('../../exeptions/NotfoundError')

class MusicService {
  constructor (cacheService) {
    this.pool = new Pool()

    this._cacheService = cacheService
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

    await this._cacheService.delete('songs:allsongs')
    return result.rows[0].id
  }

  async getMusic () {
    try {
      const resultCache = await this._cacheService.get('songs:allsongs')
      return JSON.parse(resultCache)
    } catch (error) {
      const result = await this.pool.query(
        'SELECT id, title, performer FROM songs'
      )
      await this._cacheService.set(
        'songs:allsongs',
        JSON.stringify(result.rows)
      )
      return result.rows
    }
  }

  async getMusicById (id) {
    try {
      const resultCache = await this._cacheService.get(`songs:${id}`)
      return JSON.parse(resultCache)
    } catch (error) {
      const query = {
        text: 'SELECT * FROM songs WHERE id = $1',
        values: [id],
      }
      const result = await this.pool.query(query)

      if (!result.rows.length) {
        throw new NotFoundError('Lagu tidak ditemukan')
      }

      const mappedResult = result.rows.map(mapDBToModel)[0]
      await this._cacheService.set(
        `songs:${id}`,
        JSON.stringify(mappedResult)
      )
      return mappedResult
    }
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

    await this._cacheService.delete('songs:allsongs')
    await this._cacheService.delete(`songs:${id}`)
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
    await this._cacheService.delete('songs:allsongs')
    await this._cacheService.delete(`songs:${id}`)
  }

  async verifySongIsExist (songId) {
    const query = {
      text: 'SELECT COUNT(1) FROM songs WHERE id = $1',
      values: [songId],
    }
    const result = await this.pool.query(query)
    if (!result) {
      throw new NotFoundError('Lagu yang dicari tidak ditemukan')
    }
  }
}

module.exports = MusicService
