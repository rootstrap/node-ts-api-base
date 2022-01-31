import { HttpStatusCode } from '@constants/httpStatusCode';
import { ErrorsMessages, UserErrorsMessages } from '@constants/errorMessages';
import { BaseError } from '../base.error';

export class HashExpiredError extends BaseError {
  constructor( ) {
    super(
      ErrorsMessages.NOT_ACCEPTABLE_ERROR,
      HttpStatusCode.NOT_ACCEPTABLE,
      UserErrorsMessages.HASH_EXPIRED
    );
  }
}
