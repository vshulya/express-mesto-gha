class ServerError extends Error {
  constructor(message = 'Произошла ошибка') {
    super(message);
    this.statusCode = 500;
  }
}

module.exports = ServerError;
