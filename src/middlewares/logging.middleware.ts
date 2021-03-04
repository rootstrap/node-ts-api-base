import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import morgan from 'morgan';
import { ENV } from '@config';
import { Service } from 'typedi';

@Middleware({ type: 'before' })
@Service()
export class LoggingMiddleware implements ExpressMiddlewareInterface {
  use(request: any, response: any, next: (err?: any) => any) {
    const logger = morgan('dev', {
      skip: () => {
        return ENV === 'test';
      }
    });
    logger(request, response, next);
  }
}
