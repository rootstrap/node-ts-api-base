import { HttpStatusCode } from '@constants/httpStatusCode';
import { ErrorsMessages } from '@constants/errorMessages';
import { BaseError } from '../base.error';

export class HashInvalidError extends BaseError {
  constructor( ) {
    super(
      ErrorsMessages.BAD_REQUEST_ERROR,
      HttpStatusCode.BAD_REQUEST,
      ErrorsMessages.HASH_NOT_VALID
    );
  }
}
