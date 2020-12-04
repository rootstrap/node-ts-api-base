const yenv = require('yenv');

const env = yenv('env.yaml', { env: process.env.ENVIRONMENT });

// If env wasn't provided then exit
if (!env.PORT) {
  console.error('==> Please check your env.yaml');
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
  entities: [
    process.env.ENVIRONMENT === 'prod'
      ? 'dist/src/entities/**/*.js'
      : 'src/entities/**/*.ts'
  ],
  migrations: [
    process.env.ENVIRONMENT === 'prod'
      ? 'dist/src/database/migrations/**/*.js'
      : 'src/database/migrations/**/*.ts'
  ],
  seeds: ['src/database/seeds/**/*.ts'],
  factories: ['src/database/factories/**/*.ts'],
  migrationsRun: env.TYPEORM_MIGRATIONS_RUN,
  cli: {
    migrationsDir:
      process.env.ENVIRONMENT === 'prod'
        ? 'dist/src/database/migrations'
        : 'src/database/migrations',
    entitiesDir:
      process.env.ENVIRONMENT === 'prod' ? 'dist/src/entities' : 'src/entities'
  }
};
