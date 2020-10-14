import rateLimit from 'express-rate-limit';
// import { RATE_LIMIT_WINDOW, RATE_LIMIT_MAX_REQUESTS } from '@config';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before' })
export class RateLimiterMiddleware implements ExpressMiddlewareInterface {
  async use(request: any, response: any, next: (err?: any) => any) {
    console.log('working...');
    const apiLimiter = rateLimit({
      // eslint-disable-next-line max-len
      windowMs: (15 * 60 * 1000),
      max: 2,
      handler: (_req, _res) => {
        console.log('handler');
      },
      skip: (_req, _res) => {
        console.log('skip');
        return false;
      },
      onLimitReached: (_req, _res) => {
        return console.log('limit');
      }
    });
    await apiLimiter(request, response, next);
  }
}
