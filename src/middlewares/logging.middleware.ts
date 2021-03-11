import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import morgan from 'morgan';
import { CI_ENV, TESTING_ENV } from '@config';
import { Service } from 'typedi';

@Middleware({ type: 'before' })
@Service()
export class LoggingMiddleware implements ExpressMiddlewareInterface {
  use(request: any, response: any, next: (err?: any) => any) {
    const logger = morgan('dev', {
      skip: () => {
        return TESTING_ENV || CI_ENV;
      }
    });
    logger(request, response, next);
  }
}
