import 'reflect-metadata'; // this shim is required
import express from 'express';
import helmet from 'helmet';
import { useContainer, useExpressServer } from 'routing-controllers';
import { Container } from 'typedi';
import Auth from '@middlewares/auth.middleware';
import rateLimit from 'express-rate-limit';
import { RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW } from '@config';

// required by routing-controllers
useContainer(Container);

// Create express server
const app: express.Express = express();

// Setup security headers
app.use(helmet());

// Setup express middlewares
app.use(rateLimit({
  windowMs: Number.parseInt(RATE_LIMIT_WINDOW || '900000'),
  max: Number.parseInt(RATE_LIMIT_MAX_REQUESTS || '10'),
  message: {
    status: 429,
    message: 'Too many requests, please try again later.'
  }
}));

// Wrap server with routing-controllers
useExpressServer(app, {
  routePrefix: '/api/v1',
  cors: true,
  authorizationChecker: Auth.checker,
  controllers: [`${__dirname}/controllers/*.ts`],
  middlewares: [`${__dirname}/middlewares/*.ts`],
  interceptors: [`${__dirname}/interceptors/*.ts`]
});

export default app;
