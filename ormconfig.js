const dotenv = require('dotenv');

dotenv.config({ path: `.env.${process.env.ENV || 'dev'}` });

// If .env wasn't provided then exit
if (!process.env.PORT) {
  console.error('==> Please check your .env');
  process.exit(1);
}

module.exports = {
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  port: Number.parseInt(process.env.TYPEORM_PORT || '3000'),
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  logging: process.env.TYPEORM_LOGGING,
  entities: [
    process.env.ENV === 'prod'
      ? 'dist/src/entities/**/*.js'
      : 'src/entities/**/*.ts'
  ],
  migrations: [
    process.env.ENV === 'prod'
      ? 'dist/src/database/migrations/**/*.js'
      : 'src/database/migrations/**/*.ts'
  ],
  migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN === 'true',
  cli: {
    migrationsDir:
      process.env.ENV === 'prod'
        ? 'dist/src/database/migrations'
        : 'src/database/migrations',
    entitiesDir:
      process.env.ENV === 'prod' ? 'dist/src/entities' : 'src/entities'
  }
};
