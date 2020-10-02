import rateLimit from 'express-rate-limit';
import { RATE_LIMIT_WINDOW, RATE_LIMIT_MAX_REQUESTS } from '@config';

export const limiter = rateLimit({
  windowMs: Number.parseInt(RATE_LIMIT_WINDOW || '900000'),
  max: Number.parseInt(RATE_LIMIT_MAX_REQUESTS || '100')
});
