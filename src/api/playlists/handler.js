const ClientError = require('../../exeptions/ClientError')

class PlaylistsHandler {
  constructor (playlistServices, validator, musicService, playlistMusicService) {
    this._playlistServices = playlistServices
    this._validator = validator
    this._musicService = musicService
    this._playlistMusicService = playlistMusicService

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this)
    this.getPlaylistsByUserHandler = this.getPlaylistsByUserHandler.bind(this)
    this.deletePlaylistsByIdHandler = this.deletePlaylistsByIdHandler.bind(this)
    this.postMusicToPlaylistHandler = this.postMusicToPlaylistHandler.bind(this)
    this.getMusicsPlaylistHandler = this.getMusicsPlaylistHandler.bind(this)
    this.deleteMusicPlaylistHandler = this.deleteMusicPlaylistHandler.bind(this)
  }

  async postPlaylistHandler (request, h) {
    try {
      this._validator.validatePlaylistPayload(request.payload)
      const { name } = request.payload
      const { id: credentialId } = request.auth.credentials
      const playlistId = await this._playlistServices.addPlaylist({
        name,
        credentialId,
      })

      return h
        .response({
          status: 'success',
          message: 'Playlist berhasil ditambahkan',
          data: {
            playlistId,
          },
        })
        .code(201)
    } catch (error) {
      if (error instanceof ClientError) {
        return h
          .response({
            status: 'fail',
            message: error.message,
          })
          .code(error.statuscode)
      }
      console.log(error)
      return h
        .response({
          status: 'error',
          message: 'Maaf, terjadi kesalahan pada server kami',
        })
        .code(500)
    }
  }

  async getPlaylistsByUserHandler (request, h) {
    try {
      const { id: credentialId } = request.auth.credentials
      const playlists = await this._playlistServices.getPlaylistsByUser(
        credentialId
      )

      return {
        status: 'success',
        data: {
          playlists: playlists.map((p) => ({
            id: p.id,
            name: p.name,
            username: p.username,
          })),
        },
      }
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      })
      response.code(500)
      console.error(error)
      return response
    }
  }

  async deletePlaylistsByIdHandler (request, h) {
    try {
      const { playlistId } = request.params
      const { id: credentialId } = request.auth.credentials

      await this._playlistServices.verifyPlaylistOwner(playlistId, credentialId)
      await this._playlistServices.deletePlaylistById(playlistId)

      return {
        status: 'success',
        message: 'Playlists berhasil dihapus',
      }
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        })
        response.code(error.statusCode)
        return response
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      })
      response.code(500)
      console.error(error)
      return response
    }
  }

  async postMusicToPlaylistHandler (request, h) {
    try {
      this._validator.validateMusicToPlaylistPayload(request.payload)

      const { id: credentialId } = request.auth.credentials
      const { playlistId } = request.params
      const { songId } = request.payload

      await this._musicService.verifySongIsExist(songId)
      await this._playlistServices.verifyPlaylistIsExist(playlistId)
      await this._playlistServices.verifyPlaylistAccess(playlistId, credentialId)
      await this._playlistMusicService.addMusicToPlaylist(playlistId, songId)

      return h
        .response({
          status: 'success',
          message: ' Lagu berhasil ditambahkan ke playlist',
        })
        .code(201)
    } catch (error) {
      if (error instanceof ClientError) {
        return h
          .response({
            status: 'fail',
            message: error.message,
          })
          .code(error.statuscode)
      }
      console.log(error)
      return h
        .response({
          status: 'error',
          message: 'Maaf, terjadi kesalahan pada server kami',
        })
        .code(500)
    }
  }

  async getMusicsPlaylistHandler (request, h) {
    const { id: credentialId } = request.auth.credentials
    const { playlistId } = request.params

    await this._playlistServices.verifyPlaylistAccess(playlistId, credentialId)

    const songsFromPlaylist =
      await this._playlistMusicService.getMusicsPlaylist(playlistId)

    return {
      status: 'success',
      data: {
        songs: songsFromPlaylist,
      },
    }
  }

  async deleteMusicPlaylistHandler (request, h) {
    try {
      this._validator.validateMusicToPlaylistPayload(request.payload)

      const { id: credentialId } = request.auth.credentials
      const { playlistId } = request.params
      const { songId } = request.payload

      await this._playlistServices.verifyPlaylistIsExist(playlistId)
      await this._playlistServices.verifyPlaylistAccess(playlistId, credentialId)
      await this._playlistMusicService.deleteMusicPlaylist(
        playlistId,
        songId
      )

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      }
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        })
        response.code(error.statusCode)
        return response
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      })
      response.code(500)
      console.error(error)
      return response
    }
  }
}

module.exports = PlaylistsHandler
