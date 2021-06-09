import { LoggingMiddleware } from './logging.middleware';
import { ErrorMiddleware } from './error.middleware';
import { RateMiddleware } from './rate.middleware';
import { HelmetMiddleware } from './helmet.middleware';

export const middlewares = [
  LoggingMiddleware,
  ErrorMiddleware,
  RateMiddleware,
  HelmetMiddleware
];
