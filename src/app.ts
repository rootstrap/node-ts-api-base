import 'reflect-metadata'; // this shim is required
import express from 'express';
import {
  useContainer,
  useExpressServer,
  getMetadataArgsStorage
} from 'routing-controllers';
import { Container } from 'typedi';
import Auth from '@middlewares/auth.middleware';
import rateLimit from 'express-rate-limit';
import { swaggerSpec } from './swagger';
import {
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW,
  ENVIRONMENT
} from '@config';

// required by routing-controllers
useContainer(Container);

// Create express server
const app: express.Express = express();

// Setup express middlewares
app.use(rateLimit({
  windowMs: Number.parseInt(RATE_LIMIT_WINDOW || '900000'),
  max: Number.parseInt(RATE_LIMIT_MAX_REQUESTS || '10'),
  message: {
    status: 429,
    message: 'Too many requests, please try again later.'
  }
}));

const routingControllersOptions: any = {
  routePrefix: '/api/v1',
  cors: true,
  authorizationChecker: Auth.checker,
  controllers: [`${__dirname}/controllers/*.ts`],
  middlewares: [`${__dirname}/middlewares/*.ts`],
  interceptors: [`${__dirname}/interceptors/*.ts`]
};

// Wrap server with routing-controllers
useExpressServer(app, routingControllersOptions);

// Setup Swagger
if (ENVIRONMENT !== 'prod') {
  swaggerSpec(
    getMetadataArgsStorage,
    routingControllersOptions,
    app
  );
}

export default app;
