import rateLimit from 'express-rate-limit';
import { RATE_LIMIT_WINDOW, RATE_LIMIT_MAX_REQUESTS } from '@config';

export const limiter = rateLimit({
  windowMs: Number.parseInt(RATE_LIMIT_WINDOW || '900000'),
  max: Number.parseInt(RATE_LIMIT_MAX_REQUESTS || '100'),
  handler: (req, res) => {
    // TODO: this should sent to a log in the future
    res.json({ status: 429, message: 'You are sending too many requests. Please try again later.' })
  }
});
