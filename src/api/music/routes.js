const routes = (handler) => [
  {
    method: 'POST',
    path: '/music',
    handler: handler.postMusicHandler.bind(handler)
  },
  {
    method: 'GET',
    path: '/music',
    handler: handler.getMusicHandler.bind(handler)
  },
  {
    method: 'GET',
    path: '/music/{id}',
    handler: handler.getMusicByIdHandler.bind(handler)
  },
  {
    method: 'PUT',
    path: '/music/{id}',
    handler: handler.putMusicByIdHandler.bind(handler)
  },
  {
    method: 'DELETE',
    path: '/music/{id}',
    handler: handler.deleteMusicByIdHandler.bind(handler)
  }
]

module.exports = routes
