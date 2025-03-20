class InternalServerError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message)
    this.statusCode = 500;
  }
}

export default InternalServerError