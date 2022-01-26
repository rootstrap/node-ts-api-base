import { ErrorsMessages } from '@constants/errorMessages';
import { BaseError } from './base.error';
import { HttpStatusCode } from '@constants/httpStatusCode';
export class UnauthorizedError extends BaseError {
  constructor(description: string) {
    super(
      ErrorsMessages.UNAUTHORIZED_ERROR,
      HttpStatusCode.UNAUTHORIZED,
      `Authorization is required for request on ${description}`
    );
  }
}
