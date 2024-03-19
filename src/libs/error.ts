export class InvalidParamError extends Error {
  constructor(public message: string) {
    super(message);
  }
}

export class InvalidContentError extends Error {
  constructor(public message: string) {
    super(message);
  }
}

export class NotfoundDataError extends Error {
  constructor(public message: string) {
    super(message);
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
