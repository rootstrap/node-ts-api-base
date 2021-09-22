import { DEV_ENV } from '@config';
import { ErrorsMessages } from '@constants/errorMessages';
import { HttpStatusCode } from '@constants/httpStatusCode';
import { BaseError } from '@exception/base.error';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import {
  ExpressErrorMiddlewareInterface,
  Middleware
} from 'routing-controllers';
import { Service } from 'typedi';
import { QueryFailedError } from 'typeorm';

interface ErrorInterface extends Error {
  name: string;
  httpCode: number;
  description: string | undefined;
  errors: string[] | undefined;
  stack: string | undefined;
}

@Middleware({ type: 'after' })
@Service()
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
  public error(
    error: any,
    _req: Request,
    res: Response,
    _next: (err?: any) => any
  ) {
    let responseObject = {} as ErrorInterface;

    // If the error comes from the class-validator then it's an array of ValidationError
    if (
      Array.isArray(error.errors) &&
      error.errors.every(element => element instanceof ValidationError)
    ) {
      res.status(HttpStatusCode.BAD_REQUEST);
      responseObject.httpCode = HttpStatusCode.BAD_REQUEST;
      responseObject.name = ErrorsMessages.BAD_REQUEST_ERROR;
      responseObject.description = ErrorsMessages.BODY_ERRORS;
      responseObject.errors = [];

      error.errors.forEach((element: ValidationError) => {
        const constraints = element.constraints || Object;
        Object.keys(constraints).forEach(type => {
          responseObject.errors?.push(`Property ${constraints[type]}`);
        });
      });
    } else {
      /* If it's not a 400, then it will not have multiple errors
       but it can be a custom Exception, so the array is not needed on the response.
      */
      responseObject.errors = undefined;

      if (error instanceof QueryFailedError) {
        // Is an error related to database.
        responseObject = buildDatabaseError(error);
      } else if (error instanceof BaseError) {
        // if is any custom error that extends from BaseError.
        responseObject = buildBaseError(error);
      } else if (typeof error === 'string') {
        responseObject.description = error;
      }

      if (!responseObject.httpCode) {
        responseObject.httpCode = HttpStatusCode.INTERNAL_SERVER;
        res.status(HttpStatusCode.INTERNAL_SERVER);
      }
      if (DEV_ENV) {
        responseObject.stack = error.stack;
      }

      if (responseObject.description === '') {
        responseObject.description = undefined;
      }
    }
    res.json(responseObject);
  }
}
const buildDatabaseError = (error: any): ErrorInterface => {
  const response: ErrorInterface = {} as ErrorInterface;
  response.name = ErrorsMessages.INTERNAL_SERVER_ERROR;
  // We need to check which kind of exception is comming
  response.description = getErrorMessageFromCode(error.code);
  response.httpCode = HttpStatusCode.INTERNAL_SERVER;
  return response;
};

const errorValuesPostgres = {
  '23505': ErrorsMessages.USER_ALREADY_EXIST
};

const getErrorMessageFromCode = (code: string): string => {
  let message = errorValuesPostgres[code];
  if (!message) {
    message = ErrorsMessages.UNKNOWN;
  }
  return message;
};

const buildBaseError = (error: BaseError): ErrorInterface => {
  const response: ErrorInterface = {} as ErrorInterface;

  response.name = error.name;
  response.description = error.description;
  response.httpCode = error.httpCode;

  return response;
};
