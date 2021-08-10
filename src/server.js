require('dotenv').config()

const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')

// music
const music = require('./api/music')
const MusicService = require('./services/MusicServices')
const musicValidator = require('./validator/music')

// users
const users = require('./api/users')
const UsersService = require('./services/UsersServices')
const UsersValidator = require('./validator/users')

// authentications
const authentications = require('./api/authentications')
const AuthenticationsService = require('./services/AuthenticationsService')
const TokenManager = require('./tokenize/TokenManager')
const AuthenticationsValidator = require('./validator/authentications')

// playlists
const playlists = require('./api/playlists')
const PlaylistServices = require('./services/PlaylistServices')
const PlaylistMusicService = require('./services/PlaylistMusicServices')
const PlaylistsValidator = require('./validator/playlist')

// collaboration
const collaboration = require('./api/collaborations')
const CollaborationsService = require('./services/CollaborationService')
const CollaborationsValidator = require('./validator/collaboorations')

const init = async () => {
  const collaborationsService = new CollaborationsService()
  const musicService = new MusicService()
  const usersService = new UsersService()
  const authenticationsService = new AuthenticationsService()
  const playlistServices = new PlaylistServices()
  const playlistMusicService = new PlaylistMusicService()

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  })

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
  ])

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  })

  await server.register([
    {
      plugin: music,
      options: {
        service: musicService,
        validator: musicValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },

    {
      plugin: playlists,
      options: {
        playlistServices,
        musicService,
        playlistMusicService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: collaboration,
      options: {
        collaborationsService,
        playlistServices,
        validator: CollaborationsValidator,
      },
    },
  ])

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
