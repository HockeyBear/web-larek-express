class NotFoundError extends Error {
  statusCode: number;

  constructor(message = 'Маршрут не найден.') {
    super(message);
    this.statusCode = 404;
  }
}

export default NotFoundError;
