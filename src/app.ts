/* eslint-disable quotes */
import 'reflect-metadata'; // this shim is required
import express from 'express';
import {
  useContainer,
  useExpressServer,
  getMetadataArgsStorage
} from 'routing-controllers';
import helmet from 'helmet';
import { Container } from 'typedi';
import {
  AuthMiddleware,
  LoggingMiddleware,
  ErrorMiddleware
} from '@middlewares';
import { controllers } from '@controllers';
import rateLimit from 'express-rate-limit';
import { swaggerSpec } from './swagger';
import {
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW,
  DOCS_ENABLED
} from '@config';

// required by routing-controllers
useContainer(Container);

// Create express server
const app: express.Express = express();

// Setup security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ['https://fonts.gstatic.com']
      }
    }
  })
);

// Setup express middlewares
app.use(
  rateLimit({
    windowMs: Number.parseInt(RATE_LIMIT_WINDOW || '900000'),
    max: Number.parseInt(RATE_LIMIT_MAX_REQUESTS || '10'),
    message: {
      status: 429,
      message: 'Too many requests, please try again later.'
    }
  })
);

const routingControllersOptions: any = {
  routePrefix: '/api/v1',
  defaultErrorHandler: false,
  cors: true,
  authorizationChecker: AuthMiddleware.checker,
  controllers,
  middlewares: [AuthMiddleware, LoggingMiddleware, ErrorMiddleware],
  interceptors: []
};

// Wrap server with routing-controllers
useExpressServer(app, routingControllersOptions);

// Setup Swagger
if (DOCS_ENABLED === 'true') {
  swaggerSpec(getMetadataArgsStorage, routingControllersOptions, app);
}

export default app;
