const yenv = require('yenv');

const env = yenv();

// If env wasn't provided then exit
if (!env.PORT) {
  console.error('==> Please check your env.yml');
  process.exit(1);
}

module.exports = {
  type: 'postgres',
  host: env.TYPEORM_HOST,
  username: env.TYPEORM_USERNAME,
  password: env.TYPEORM_PASSWORD,
  database: env.TYPEORM_DATABASE,
  port: env.TYPEORM_PORT,
  synchronize: env.TYPEORM_SYNCHRONIZE,
  logging: env.TYPEORM_LOGGING,
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/database/migrations/**/*.ts'],
  seeds: ['src/database/seeds/**/*.ts'],
  factories: ['src/database/factories/**/*.ts'],
  migrationsRun: env.TYPEORM_MIGRATIONS_RUN,
  cli: {
    migrationsDir: 'src/database/migrations',
    entitiesDir: 'src/entities'
  }
};
