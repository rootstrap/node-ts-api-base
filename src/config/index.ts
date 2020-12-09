const dotenv = require('dotenv');

dotenv.config({ path: `.env.${process.env.ENVIRONMENT}` });

// If .env wasn't provided then exit
if (!process.env.PORT) {
  console.error('==> Please check your .env');
  process.exit(1);
}

export const {
  PORT,
  JWT_SECRET,
  ACCESS_TOKEN_LIFE,
  ENVIRONMENT,
  SENDGRID_API_KEY,
  SENDGRID_EMAIL,
  RATE_LIMIT_WINDOW,
  RATE_LIMIT_MAX_REQUESTS,
  S3_ID,
  S3_SECRET,
  S3_BUCKETNAME,
  DOCS_ENABLED,
  CONFIRMATION_URL
} = process.env;
