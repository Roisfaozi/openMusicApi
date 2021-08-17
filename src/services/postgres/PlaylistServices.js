const { nanoid } = require('nanoid')
const { Pool } = require('pg')

const InvariantError = require('../../exeptions/InvariantError')
const NotFoundError = require('../../exeptions/NotFoundError')
const AuthorizationError = require('../../exeptions/AuthorizationsError')

class PlaylistServices {
  constructor (cacheService) {
    this._pool = new Pool()
    this._cacheService = cacheService
  }

  async addPlaylist ({ name, owner }) {
    const id = `playlist-${nanoid(16)}`
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    }
    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan')
    }
    await this._cacheService.delete(`playlists:${owner}`)
    return result.rows[0].id
  }

  async getPlaylistsByUser (owner) {
    try {
      const resultCache = await this._cacheService.get(`playlists:${owner}`)
      return JSON.parse(resultCache)
    } catch (error) {
      const query = {
        text: 'SELECT playlists.id, playlists.name, users.username FROM playlists INNER JOIN users ON playlists.owner = users.id LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id WHERE playlists.owner= $1 OR collaborations.user_id = $1',
        values: [owner],
      }

      const result = await this._pool.query(query)
      await this._cacheService.set(
        `playlists:${owner}`,
        JSON.stringify(result.rows)
      )
      return result.rows
    }
  }

  async deletePlaylistById (playlistId, userId) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1',
      values: [playlistId],
    }
    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Playlist gagal dihapus, Id tidak ditemukan')
    }
    await this._cacheService.delete(`playlists:${userId}`)
  }

  async verifyPlaylistOwner (id, owner) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [id],
    }
    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Playlist yang anda cari tidak ada')
    }
    const playlist = result.rows[0]
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini')
    }
  }

  async verifyPlaylistAccess (playlistId, userId) {
    const query = {
      text: 'SELECT playlists.id FROM playlists INNER JOIN users ON playlists.owner = users.id LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id WHERE (playlists.owner = $2 OR collaborations.user_id = $2) AND playlists.id =$1',
      values: [playlistId, userId],
    }
    const result = await this._pool.query(query)
    if (!result.rows[0]) {
      throw new AuthorizationError('Anda bukan Kolaborator playlist ini')
    }
  }

  async verifyPlaylistIsExist (playlistId) {
    const query = {
      text: 'SELECT COUNT(1) FROM playlists WHERE id = $1',
      values: [playlistId],
    }
    const result = await this._pool.query(query)
    if (!result) {
      throw new NotFoundError('Playlist yang dicari tidak ditemukan')
    }
  }
}

module.exports = PlaylistServices
