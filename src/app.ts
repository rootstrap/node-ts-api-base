import "reflect-metadata"; // this shim is required
import { createExpressServer, useContainer } from "routing-controllers";
import { Container } from "typedi";
import { createConnection } from "typeorm";
import AdminBro from 'admin-bro';
//TODO: Check how to change this to TS import
const AdminBroExpress = require('@admin-bro/express')
import { Database, Resource } from '@admin-bro/typeorm';
import authorizationChecker from "./middleware/auth.middleware";
import { User } from './entities/user.entity';
import { PORT } from "./config";

// set container before any operation you do with routing-controllers
useContainer(Container);

AdminBro.registerAdapter({ Database, Resource });

createConnection().then(async connection => {
  // creates express app, registers all controller routes and returns you express app instance
  const app = createExpressServer({
    routePrefix: "/api/v1",
    cors: true,
    authorizationChecker,
    controllers: [__dirname + "/controllers/*.ts"],
    middlewares: [__dirname + "/middlewares/*.ts"],
    interceptors: [__dirname + "/interceptors/*.ts"],
  });

  // creates admin panel, register all resources and their options
  const adminBro = new AdminBro({
    databases: [connection],
    resources: [
      { resource: User, options: { parent: { name: 'resources', icon: 'Home' } } }
    ],
    rootPath: '/admin',
    branding: {
      companyName: 'Rootstrap',
    },
  });

  // Add admin as middleware
  const router = AdminBroExpress.buildRouter(adminBro);
  app.use(adminBro.options.rootPath, router);

  // run express application on port 3000
  app.listen(PORT, (err: any) => {
    if (err) return console.error(err);
    return console.log(`Server is listening on ${PORT}`);
  });
}).catch(err => console.log(err));
