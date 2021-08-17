const ExportsHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'exports music from playlist',
  version: '1.0.0',
  register: async (server, { service, playlistServices, validator }) => {
    const exportsHandler = new ExportsHandler(
      service,
      playlistServices,
      validator
    )
    server.route(routes(exportsHandler))
  },
}
