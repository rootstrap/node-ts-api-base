import { HttpStatusCode } from '@constants/httpStatusCode';
import { ErrorsMessages } from '@constants/errorMessages';
import { BaseError } from '../base.error';

export class UserNotFoundError extends BaseError {
  constructor( ) {
    super(
      ErrorsMessages.NOT_FOUND_ERROR,
      HttpStatusCode.NOT_FOUND,
      ErrorsMessages.USER_NOT_FOUND
    );
  }
}
