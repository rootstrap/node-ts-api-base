/* eslint-disable quotes */
import 'reflect-metadata'; // this shim is required
import express from 'express';
import {
  useContainer,
  useExpressServer,
  getMetadataArgsStorage
} from 'routing-controllers';
import { Container } from 'typedi';
import { AuthorizationService } from '@services/auth.service';
import { middlewares } from '@middlewares';
import { controllers } from '@controllers';
import { swaggerSpec } from './swagger';
import { DOCS_ENABLED } from '@config';

// required by routing-controllers
useContainer(Container);

// Create express server
const app: express.Express = express();

const routingControllersOptions: any = {
  routePrefix: '/api/v1',
  defaultErrorHandler: false,
  cors: true,
  authorizationChecker: AuthorizationService.getInstance().authorizationChecker,
  controllers,
  middlewares,
  interceptors: []
};

// Wrap server with routing-controllers
useExpressServer(app, routingControllersOptions);

// Setup Swagger
if (DOCS_ENABLED === 'true') {
  swaggerSpec(getMetadataArgsStorage, routingControllersOptions, app);
}

export default app;
