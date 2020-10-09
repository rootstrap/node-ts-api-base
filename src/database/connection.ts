import { createConnection, getConnection, Connection } from 'typeorm';
import { databaseConfig } from '@config';

const connection = {
  async create(callback?: (c: Connection) => void): Promise<void> {
    try {
      const connection = await createConnection(databaseConfig);
      if (callback) {
        callback(connection);
      }
    } catch (e) {
      console.log(e);
    }
  },

  async close(): Promise<void> {
    await getConnection().close();
  },

  async clear(): Promise<void> {
    const connection = getConnection();
    const entities = connection.entityMetadatas;

    entities.forEach(async entity => {
      const repository = connection.getRepository(entity.name);
      try {
        await repository.clear();
      } catch (e) {}
    });
  }
};

export default connection;
