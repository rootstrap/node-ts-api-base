import { HttpStatusCode } from '@constants/httpStatusCode';
import { ErrorsMessages, TargetErrorsMessages } from '@constants/errorMessages';
import { BaseError } from '../base.error';

export class TargetNotSavedException extends BaseError {
  constructor( description: string ) {
    super(
      ErrorsMessages.BAD_REQUEST_ERROR,
      HttpStatusCode.BAD_REQUEST,
      `${TargetErrorsMessages.TARGET_NOT_SAVED}: ${description}`
    );
  }
}
