/**
 * CONFIG file, either loaded via .env file or system ENV
 */
const { DATABASE_URL, LOGTAIL_TOKEN, MONGO_DEBUG, NODE_HOST, NODE_PORT, ADMIN_JWT, TOKEN_SECRET_ADMIN, TOKEN_SECRET, SENTRY } = process.env;

const config = {
  MONGO_URL: DATABASE_URL || 'mongodb://localhost:27017/signalytics',
  MONGO_DEBUG: MONGO_DEBUG || false,
  LOGTAIL_TOKEN: LOGTAIL_TOKEN || 'xxxxx',
  PROJECT_NAME: 'NOTIFICATION SERVICE',
  NODE_HOST: NODE_HOST || 'localhost',
  NODE_PORT: NODE_PORT || 8080,
  // we use this if we run the services locally and in order not to have a conflict with other service's port number
  NODE_PORT_ALT: 3000,
  TOKEN_SECRET,
  TOKEN_SECRET_ADMIN,
  ADMIN_JWT,
  SENTRY,
};

export default config;
