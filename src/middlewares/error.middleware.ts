import { Request, Response } from 'express';
import {
  Middleware,
  ExpressErrorMiddlewareInterface
} from 'routing-controllers';
import { DEV_ENV } from '@config';
import { Service } from 'typedi';

interface ErrorInterface extends Error {
  httpCode: number;
}

@Middleware({ type: 'after' })
@Service()
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
  error(
    error: ErrorInterface,
    _req: Request,
    res: Response,
    _next: (err?: ErrorInterface) => ErrorInterface
  ) {
    if (DEV_ENV) {
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
