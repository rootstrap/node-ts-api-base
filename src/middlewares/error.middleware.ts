/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { TESTING_ENV } from '@config';
import { Service } from 'typedi';

interface ErrorInterface extends Error {
  httpCode:number;
}

@Middleware({ type: 'after' })
@Service()
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
  // eslint-disable-next-line max-len
  error(error: ErrorInterface, req: Request, res: Response, next: (err?: ErrorInterface) => ErrorInterface) {
    if (TESTING_ENV) {
      console.error(`Message: ${error.message}`);
      console.error(`Stack: ${error.stack}`);
    }
    res.status(error.httpCode || 500);
    res.json({
      errCode: error.httpCode,
      errMessage: error.message
    });
  }
}
