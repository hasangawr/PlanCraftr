export const commonErrors = Object.freeze({
  success: { name: 'Success', httpCode: 200 },
  created: { name: 'Created', httpCode: 201 },
  badRequest: { name: 'Bad Request', httpCode: 400 },
  notFound: { name: 'Not Found', httpCode: 404 },
  serverError: { name: 'Server Error', httpCode: 500 },
});

export class AppError extends Error {
  public readonly name: string;
  public readonly httpCode: number;
  public readonly isOperational: boolean;

  constructor(
    name: string,
    httpCode: number,
    description: string,
    isOperational: boolean,
  ) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}
