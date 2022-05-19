class NotFoundError extends Error {
  constructor(message = 'Cannot read properties of undefined') {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
