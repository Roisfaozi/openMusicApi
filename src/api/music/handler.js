const ClientError = require('../../exeptions/ClientError')

class MusicHandler {
  constructor (service, validator) {
    this.service = service
    this.validator = validator

    this.postMusicHandler = this.postMusicHandler.bind(this)
    this.getMusicHandler = this.getMusicHandler.bind(this)
    this.getMusicByIdHandler = this.getMusicByIdHandler.bind(this)
    this.putMusicByIdHandler = this.putMusicByIdHandler.bind(this)
    this.deleteMusicByIdHandler = this.deleteMusicByIdHandler.bind(this)
  }

  async postMusicHandler (request, h) {
    try {
      this.validator.validateMusicPayload(request.payload)

      const {
        title,
        year,
        performer,
        genre = null,
        duration = null
      } = request.payload

      const songId = await this.service.addMusic(title, year, performer, genre, duration)
      return h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: {
          songId
        }
      })
        .code(201)
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message
        })
          .code(error.statuscode)
      }
      console.log(error)
      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kesalahan pada server kami'
      })
        .code(500)
    }
  }

  async getMusicHandler () {
    const songs = await this.service.getMusic()

    return {
      status: 'success',
      data: {
        songs
      }
    }
  }

  async getMusicByIdHandler (request, h) {
    const { id } = request.params

    try {
      const song = await this.service.getMusicById(id)

      return {
        status: 'success',
        data: {
          song
        }
      }
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message
        })
          .code(error.statuscode)
      }

      console.log(error)
      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami'
      })
        .code(500)
    }
  }

  async putMusicByIdHandler (request, h) {
    try {
      this.validator.validateMusicPayload(request.payload)

      const { id } = request.params
      const {
        title,
        year,
        performer,
        genre = null,
        duration = null
      } = request.payload

      await this.service.editMusicById(id, title, year, performer, genre, duration)
      return {
        status: 'success',
        message: 'Lagu berhasil diperbarui'
      }
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
      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami'
      })
        .code(500)
    }
  }

  async deleteMusicByIdHandler (request, h) {
    const { id } = request.params

    try {
      await this.service.deleteMusicById(id)

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus'
      }
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
      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami'
      })
        .code(500)
    }
  }
}

module.exports = MusicHandler
