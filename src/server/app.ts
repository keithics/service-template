import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import * as Sentry from '@sentry/node';
import cors from 'cors';
import * as path from 'path';
import routes from './routes';
import errorHandler from '@keithics/errors/lib/handler.error';
import config from './config';
import sentry from '@keithics/core/lib/sentry';
import logger from '@keithics/core/lib/logger';
import { mongo } from './mongo';

/**
 * Express App
 */

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger({ logTailToken: config.LOGTAIL_TOKEN, resource: config.PROJECT_NAME }));

app.use(routes);
app.set('trust proxy', 1);
(async () => {
  await mongo.init();
})();

if (process.env.NODE_ENV === 'production') {
  sentry(app, config.SENTRY);
}

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(Sentry.Handlers.errorHandler());

app.use(errorHandler);

export default app;

process.on('uncaughtException', (err) => {
  throw err;
  // add sentry here
});

process.on('unhandledRejection', (up) => {
  throw up;
});
