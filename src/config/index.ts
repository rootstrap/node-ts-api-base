import * as dotenv from 'dotenv';
import { ConnectionOptions } from 'typeorm';

const envFile = process.env.ENVIRONMENT
  ? `.env.${process.env.ENVIRONMENT}`
  : '.env';
dotenv.config({ path: envFile });

// If .env wasn't provided then exit
if (!process.env.PORT) {
  console.error('==> Please check your .env');
  process.exit(1);
}

export const databaseConfig: ConnectionOptions = {
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  port: Number.parseInt(process.env.TYPEORM_PORT || '3000'),
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  logging: process.env.TYPEORM_LOGGING === 'true',
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/database/migrations/**/*.ts'],
  migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN === 'true',
  cli: {
    migrationsDir: 'src/database/migrations/**/*.ts',
    entitiesDir: 'src/entities/**/*.ts'
  }
};

export const {
  PORT,
  JWT_SECRET,
  ACCESS_TOKEN_LIFE,
  ENVIRONMENT,
  SENDGRID_API_KEY,
  SENDGRID_EMAIL
} = process.env;
