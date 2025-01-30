import { INTERNAL_SERVER_ERROR } from '#enums'

export class AppError extends Error {
  public statusCode: number

  constructor(
    message: string = INTERNAL_SERVER_ERROR,
    statusCode: number = 500
  ) {
    super(message)
    this.statusCode = statusCode
    Error.captureStackTrace(this, this.constructor)
  }
}
