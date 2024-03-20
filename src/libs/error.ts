class BaseError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(public message: string) {
    super(message);
    this.statusCode = 500;
    this.isOperational = true;
  }
}

export class InvalidParamError extends BaseError {
  constructor(public message: string) {
    super(message);
    this.statusCode = 422;
    this.isOperational = true;
  }
}

export class InvalidContentError extends BaseError {
  constructor(public message: string) {
    super(message);
    this.statusCode = 422;
    this.isOperational = true;
  }
}

export class NotfoundDataError extends BaseError {
  constructor(public message: string) {
    super(message);
    this.statusCode = 404;
    this.isOperational = true;
  }
}

export class UnauthorizedError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(public message: string) {
    super(message);
    this.statusCode = 401;
    this.isOperational = true;
  }
}
