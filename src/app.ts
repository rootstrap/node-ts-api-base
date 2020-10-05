import 'reflect-metadata'; // this shim is required
import { createExpressServer, useContainer } from 'routing-controllers';
import { Container } from 'typedi';
import authorizationChecker from '@middlewares/auth.middleware';

// required by routing-controllers
useContainer(Container);

// middlewares to load with the app:
let middlewares: string[] = ['auth.middleware.ts'];

// skip logging during testing
if (process.env.ENVIRONMENT !== 'test') {
  middlewares.push('logging.middleware.ts');
}

const prefix = `${__dirname}/middlewares/`;
middlewares = middlewares.map(value => `${prefix}${value}`);

const app = createExpressServer({
  routePrefix: '/api/v1',
  cors: true,
  authorizationChecker: authorizationChecker,
  controllers: [__dirname + '/controllers/*.ts'],
  middlewares,
  interceptors: [__dirname + '/interceptors/*.ts']
});

export default app;
