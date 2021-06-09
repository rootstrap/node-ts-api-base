import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import helmet from 'helmet';
import { Service } from 'typedi';

@Middleware({ type: 'before' })
@Service()
export class HelmetMiddleware implements ExpressMiddlewareInterface {
  use(request: any, response: any, next: (err?: any) => any): any {
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ['\'self\''],
          scriptSrc: ['\'self\'', '\'unsafe-inline\'', '\'unsafe-eval\''],
          styleSrc: [
            '\'self\'',
            '\'unsafe-inline\'',
            'https://fonts.googleapis.com'
          ],
          fontSrc: ['https://fonts.gstatic.com']
        }
      }
    })(request, response, next);
  }
}
