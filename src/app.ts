import 'reflect-metadata'; // this shim is required
import express from 'express';
import { useContainer, useExpressServer } from 'routing-controllers';
import { Container } from 'typedi';
import authorizationChecker from '@middleware/auth.middleware';
import { limiter } from '@middleware/rateLimiter.middleware';

// required by routing-controllers
useContainer(Container);

// Creates express app
let app: express.Express = express();

// Set requests limiter
app.use(limiter);

useExpressServer(app, {
  routePrefix: '/api/v1',
  cors: true,
  authorizationChecker: authorizationChecker,
  controllers: [`${__dirname}/controllers/*.ts`],
  middlewares: [`${__dirname}/middlewares/*.ts`],
  interceptors: [`${__dirname}/interceptors/*.ts`]
});

export default app;
