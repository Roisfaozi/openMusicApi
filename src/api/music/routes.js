const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.postMusicHandler.bind(handler),
    // options: {
    //   auth: 'openmusic_jwt',
    // },
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getMusicHandler.bind(handler),
    // options: {
    //   auth: 'openmusic_jwt',
    // },
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: handler.getMusicByIdHandler.bind(handler),
    // options: {
    //   auth: 'openmusic_jwt',
    // },
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: handler.putMusicByIdHandler.bind(handler),
    // options: {
    //   auth: 'openmusic_jwt',
    // },
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: handler.deleteMusicByIdHandler.bind(handler),
    // options: {
    //   auth: 'openmusic_jwt',
    // },
  }
]

module.exports = routes
