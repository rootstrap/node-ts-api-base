import { HttpStatusCode } from '@constants/httpStatusCode';
import { ErrorsMessages, UserErrorsMessages } from '@constants/errorMessages';
import { BaseError } from '../base.error';

export class HashInvalidError extends BaseError {
  constructor( ) {
    super(
      ErrorsMessages.BAD_REQUEST_ERROR,
      HttpStatusCode.BAD_REQUEST,
      UserErrorsMessages.HASH_NOT_VALID
    );
  }
}
