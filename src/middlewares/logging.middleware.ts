import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';

@Middleware({ type: 'before' })
export class LoggingMiddleware implements ExpressMiddlewareInterface {
  use(request: any, _response: any, next: (err?: any) => any) {
    console.log(`${request.method} ${request.path}`);
    next();
  }
}
