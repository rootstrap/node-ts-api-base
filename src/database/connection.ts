import { createConnection, getConnection } from 'typeorm';

const connection = {
  async create(callback: Function | null = null) {
    try {
      let connection = await createConnection();
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
      await repository.query(`DELETE FROM public.${entity.tableName}`);
    });
  }
};

export default connection;
