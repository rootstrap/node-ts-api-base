import yenv from 'yenv';

const env = yenv();

// If .env wasn't provided then exit
if (!env.PORT) {
  console.error('==> Please check your .env');
  process.exit(1);
}

export const {
  ENVIRONMENT,
  PORT,
  JWT_SECRET,
  ACCESS_TOKEN_LIFE,
  RATE_LIMIT_WINDOW,
  RATE_LIMIT_MAX_REQUESTS,
  S3_ID,
  S3_SECRET,
  S3_BUCKETNAME,
  DOCS_ENABLED
} = process.env;
