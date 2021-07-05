const InvariantError = require('../../exeptions/InvariantError')
const { musicPayloadSchema } = require('./schema')

const musicValidator = {
  validateMusicPayload (payload) {
    const validationResult = musicPayloadSchema.validate(payload)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = musicValidator
