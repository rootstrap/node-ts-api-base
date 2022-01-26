import { HttpStatusCode } from '@constants/httpStatusCode';
import { ErrorsMessages } from '@constants/errorMessages';
import { BaseError } from '../base.error';

export class HashExpiredError extends BaseError {
  constructor( ) {
    super(
      ErrorsMessages.NOT_ACCEPTABLE_ERROR,
      HttpStatusCode.NOT_ACCEPTABLE,
      ErrorsMessages.HASH_EXPIRED
    );
  }
}
