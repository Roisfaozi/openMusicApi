
const InvariantError = require('../../exeptions/InvariantError')
const { PlaylistPayloadSchema, MusicToPlaylistSchema } = require('./schema')

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
  validateMusicToPlaylistPayload: (payload) => {
    const validationResult = MusicToPlaylistSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
}

module.exports = PlaylistsValidator
