/**
 * CONFIG file, either loaded via .env file or system ENV
 */
const { MONGO_URL_TEST } = process.env;
const config = {
  MONGO_URL: MONGO_URL_TEST || 'mongodb://localhost:27017/signalytics-test',
  DEBUG_MONGO: false,
  NODE_HOST: 'localhost',
  NODE_PORT: 3000,
  TOKEN_SECRET: 'token_test',
  TOKEN_SECRET_ADMIN: 'admin_token_test',
  LOGTAIL_TOKEN: 'xx',
  SENTRY: 'https://xxx@xxx.ingest.sentry.io/xxx',
};

export default config;
