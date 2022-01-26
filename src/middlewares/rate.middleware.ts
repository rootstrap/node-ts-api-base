import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import rateLimit from 'express-rate-limit';
import {
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW
} from '@config';
import { Service } from 'typedi';
import { HttpStatusCode } from '@constants/httpStatusCode';
import { ErrorsMessages } from '@constants/errorMessages';

const limiter = rateLimit({
  // RATE_LIMIT_WINDOW minutes
  windowMs: Number.parseInt(RATE_LIMIT_WINDOW || '5') * 60 * 1000,
  max: Number.parseInt(RATE_LIMIT_MAX_REQUESTS || '100'),
  headers: true,
  message: {
    status: HttpStatusCode.TOO_MANY_REQUESTS,
    message: ErrorsMessages.TOO_MANY_REQUESTS_ERROR
  }
});

@Middleware({ type: 'before' })
@Service()
export class RateMiddleware implements ExpressMiddlewareInterface {
  use(request: any, response: any, next: (err?: any) => any): any {
    limiter(request, response, next);
  }
}
