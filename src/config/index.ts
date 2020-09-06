import * as dotenv from 'dotenv';

const envFile = process.env.ENVIRONMENT ? `.env.${process.env.ENVIRONMENT}` : '.env'
dotenv.config({ path: envFile })

// If .env wasn't provided then exit
if (!process.env.PORT) {
  console.error('==> Please check your .env');
  process.exit(1);
}

export const {
  PORT,
  DB_NAME,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  JWT_SECRET,
} = process.env;
