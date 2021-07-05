const Joi = require('joi')

const musicPayloadSchema = Joi.object({
  title: Joi.string().max(100).required(),
  year: Joi.number().max(32767).required(),
  performer: Joi.string().max(50).required(),
  genre: Joi.string().max(50),
  duration: Joi.number().max(32767)
})

module.exports = { musicPayloadSchema }
