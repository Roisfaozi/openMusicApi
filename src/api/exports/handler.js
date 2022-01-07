const ClientError = require('../../exeptions/ClientError')

class ExportsHandler {
  constructor(service, playlistServices, validator) {
    this._service = service
    this._playlistServices = playlistServices
    this._validator = validator

    this.postExportPlaylistMusicHandler =
      this.postExportPlaylistMusicHandler.bind(this)
  }

  async postExportPlaylistMusicHandler(request, h) {
    try {
      this._validator.validateExportMusicPayload(request.payload)
      const { id: userId } = request.auth.credentials
      const { playlistId } = request.params
      await this._playlistServices.verifyPlaylistAccess(playlistId, userId)

      const message = {
        userId,
        playlistId,
        targetEmail: request.payload.targetEmail,
      }

      await this._service.sendMessage(
        process.env.PLAYLIST_CHANNEL_NAME,
        JSON.stringify(message)
      )

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda dalam antrean',
      })
      response.code(201)
      return response
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        })
        response.code(error.statuscode)
        console.log(error)
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

module.exports = ExportsHandler
