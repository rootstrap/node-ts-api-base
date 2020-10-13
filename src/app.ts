import 'reflect-metadata'; // this shim is required
import express from 'express';
import { useContainer, useExpressServer } from 'routing-controllers';
import { Container } from 'typedi';
import { limiter } from '@middleware/rateLimiter.middleware';
import Auth from '@middlewares/auth.middleware';

// required by routing-controllers
useContainer(Container);

// Creates express app
let app: express.Express = express();

// Set requests limiter
app.use(limiter);

useExpressServer(app, {
  routePrefix: '/api/v1',
  cors: true,
  authorizationChecker: Auth.checker,
  controllers: [`${__dirname}/controllers/*.ts`],
  middlewares: [`${__dirname}/middlewares/*.ts`],
  interceptors: [`${__dirname}/interceptors/*.ts`]
});

export default app;
