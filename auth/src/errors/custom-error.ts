export abstract class CustomError extends Error {
  abstract statusCode: number;
  constructor(messageToLog: string) {
    super(messageToLog);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
  abstract serializeErrors(): { message: string; field?: string }[];
}
