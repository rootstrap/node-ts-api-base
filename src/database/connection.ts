import { createConnection, getConnection } from 'typeorm';
import { databaseConfig } from '@config';

const connection = {
  async create(callback: Function | null = null) {
    try {
      let connection = await createConnection(databaseConfig);
      if (callback) callback(connection);
    } catch (e) {
      console.log(e);
    }
  },

  async close() {
    await getConnection().close();
  },

  async clear() {
    const connection = getConnection();
    const entities = connection.entityMetadatas;

    entities.forEach(async entity => {
      const repository = connection.getRepository(entity.name);
      await repository.clear();
    });
  }
};

export default connection;
