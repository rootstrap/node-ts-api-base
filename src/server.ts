import 'reflect-metadata'; // this shim is required
import { Connection } from 'typeorm';
import AdminBro from 'admin-bro';
import AdminBroExpress from '@admin-bro/express';
import { Database, Resource } from '@admin-bro/typeorm';
import { User } from '@entities/user.entity';
import { PORT } from '@config';
import connection from '@database/connection';
import app from '@app';

const handleConnection = async (connection: Connection) => {
  // creates admin panel, register all resources and their options
  AdminBro.registerAdapter({ Database, Resource });
  const adminBro = new AdminBro({
    databases: [connection],
    resources: [
      {
        resource: User,
        options: { parent: { name: 'resources', icon: 'Home' } }
      }
    ],
    rootPath: '/admin',
    branding: {
      companyName: 'Rootstrap',
      softwareBrothers: false
    },
    dashboard: {
      component: AdminBro.bundle('./admin/dashboard')
    }
  });

  // Add admin as middleware
  const router = AdminBroExpress.buildRouter(adminBro);
  app.use(adminBro.options.rootPath, router);

  // run express application on given port
  app.listen(PORT, () => {
    return console.log(`Server is listening on ${PORT}`);
  });
};

connection.create(handleConnection);
