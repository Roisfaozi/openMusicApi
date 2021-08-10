const PlaylistsHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'Playlists',
  version: '1.0.0',
  register: async (
    server,
    {
      playlistServices,
      validator,
      musicService,
      playlistMusicService
    }
  ) => {
    const playlistsHandler = new PlaylistsHandler(
      playlistServices,
      validator,
      musicService,
      playlistMusicService
    )
    server.route(routes(playlistsHandler))
  },
}
