require('dotenv').config()

const Hapi = require('@hapi/hapi')

// music
const music = require('./api/music')
const MusicService = require('./services/MusicServices')
const musicValidator = require('./validator/music')

// users
const users = require('./api/users')
const UsersService = require('./services/postgres/UserService')
const UsersValidator = require('./validator/users')

const init = async () => {
  const musicService = new MusicService()
  const usersService = new UsersService()

  const server = Hapi.server({

    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.register([
    {
      plugin: music,
      options: {
        service: musicService,
        validator: musicValidator
      }
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    }
  ])

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
