const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exeptions/InvariantError')

class PlaylistMusicService {
  constructor (cacheService) {
    this._pool = new Pool()
    this._cacheService = cacheService
  }

  async addMusicToPlaylist (playlistId, songId) {
    const id = `playSong-${nanoid(16)}`
    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    }
    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist')
    }
    await this._cacheService.delete(`playlistSongs:${playlistId}`)
    return result.rows[0].id
  }

  async getMusicsPlaylist (playlistId) {
    try {
      const resultCache = await this._cacheService.get(
        `playlistSongs:${playlistId}`
      )
      return JSON.parse(resultCache)
    } catch (error) {
      const query = {
        text: 'SELECT songs.id, songs.title,songs.performer FROM playlists INNER JOIN playlistsongs ON playlistsongs.playlist_id = playlists.id INNER JOIN songs ON songs.id = playlistsongs.song_id WHERE playlists.id = $1',
        values: [playlistId],
      }
      const result = await this._pool.query(query)
      if (!result.rows) {
        throw new InvariantError('Gagal Memuat lagu dari playlist')
      }
      await this._cacheService.set(
        `playlistSongs:${playlistId}`,
        JSON.stringify(result.rows)
      )
      return result.rows
    }
  }

  async deleteMusicPlaylist (playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    }
    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new InvariantError(
        'Lagu gagal dihapus dari playlist, Id tidak ditemukan'
      )
    }
    await this._cacheService.delete(`playlistSongs:${playlistId}`)
  }
}
module.exports = PlaylistMusicService
