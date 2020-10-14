import 'reflect-metadata'; // this shim is required
import { createExpressServer, useContainer } from 'routing-controllers';
import { Container } from 'typedi';
import Auth from '@middlewares/auth.middleware';

// required by routing-controllers
useContainer(Container);

// Creates express app
const app = createExpressServer({
  routePrefix: '/api/v1',
  cors: true,
  authorizationChecker: Auth.checker,
  controllers: [`${__dirname}/controllers/*.ts`],
  middlewares: [`${__dirname}/middlewares/*.ts`],
  interceptors: [`${__dirname}/interceptors/*.ts`]
});

export default app;
