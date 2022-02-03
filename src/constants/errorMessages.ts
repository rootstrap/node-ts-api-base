import {
  BadRequestError,
  HttpError,
  InternalServerError,
  UnauthorizedError
} from 'routing-controllers';

export enum ErrorsMessages {
  MISSING_PARAMS = 'Missing params on body',
  INVALID_CREDENTIALS = 'Invalid credentials',
  EMAIL_NOT_SENT = 'Error at sending email',
  REDIS_ERROR = 'Error in redis database',
  REDIS_ERROR_SET_TOKEN = "Error setting user's token in blacklist",
  UNKNOWN = 'Unknown error',
  BODY_ERRORS = "You have errors in your request's body." +
    "Check 'errors' field for more details.",
  TOO_MANY_REQUESTS_ERROR = 'Too many requests, please try again later.',
  PASSWORD_ERROR = 'Property password must be longer than or equal to 6 characters',
  EMAIL_NOT_EMAIL = 'Property email must be an email',
  // HTTP STANDARD MESSAGES
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
  BAD_REQUEST_ERROR = 'Bad request error',
  NOT_FOUND_ERROR = 'Not found error',
  NOT_ACCEPTABLE_ERROR = 'Not acceptable error',
  UNAUTHORIZED_ERROR = 'AuthorizationRequiredError'
}

export enum UserErrorsMessages {
  USER_ALREADY_EXISTS = 'A user with this email is already registered',
  USER_FIRST_NAME_NOT_EMPTY = 'Property firstName should not be empty',
  USER_FIRST_NAME_STRING = 'Property firstName must be a string',
  USER_LAST_NAME_NOT_EMPTY = 'Property lastName should not be empty',
  USER_LAST_NAME_STRING = 'Property lastName must be a string',
  USER_GENDER_ENUM = 'Property gender must be a valid enum value',
  USER_GENDER_NOT_EMPTY = 'Property gender should not be empty',
  HASH_NOT_VALID = 'Please try again or request a new link',
  HASH_EXPIRED = 'The link has expired, please request a new one',
  USER_NOT_FOUND = 'The user cannot be found',
  USER_NOT_SAVED = 'The user cannot be saved'

}

export enum TargetErrorsMessages {
  TARGET_TITLE_MIN_LENGTH = 'Property title should have a minimum length of 4',
  TARGET_TITLE_NOT_EMPTY = 'Property title should not be empty',
  TARGET_TITLE_STRING = 'Property title must be a string',
  TARGET_RADIUS_GREATER_0 = 'Property radius must be greater than 0',
  TARGET_RADIUS_NOT_EMPTY = 'Property radius should not be empty',
  TARGET_RADIUS_NUMBER = 'Property radius must be a number',
  TARGET_NOT_SAVED = 'The target could not be saved',
  TARGET_USER_MORE_10 = 'Cannot create more than 10 targets'
}


export const Errors = {
  [ErrorsMessages.MISSING_PARAMS]: new BadRequestError(
    ErrorsMessages.MISSING_PARAMS
  ),
  [ErrorsMessages.INVALID_CREDENTIALS]: new UnauthorizedError(
    ErrorsMessages.INVALID_CREDENTIALS
  ),
  // Throw a BadGateway error
  [ErrorsMessages.EMAIL_NOT_SENT]: new HttpError(
    502,
    ErrorsMessages.EMAIL_NOT_SENT
  ),
  [ErrorsMessages.BAD_REQUEST_ERROR]: new InternalServerError(
    ErrorsMessages.BAD_REQUEST_ERROR
  )
};
