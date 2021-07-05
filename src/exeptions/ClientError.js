class ClientError {
  constructor(message, statuscode = 400) {
    super(message)

    this.statuscode = statuscode
    this.name = 'ClientError'
  }
} 

module.exports = ClientError;