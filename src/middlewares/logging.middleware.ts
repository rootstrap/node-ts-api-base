import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import morgan from 'morgan';
import { ENVIRONMENT } from '@config';

@Middleware({ type: 'before' })
export class LoggingMiddleware implements ExpressMiddlewareInterface {
  use(request: any, response: any, next: (err?: any) => any) {
    const logger = morgan('dev', {
      skip: () => {
        return ENVIRONMENT === 'test';
      }
    });
    logger(request, response, next);
  }
}
