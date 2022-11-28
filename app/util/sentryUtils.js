/* eslint-disable import/no-namespace */
import * as Sentry from '@sentry/react-native';
import { Dedupe, ExtraErrorData } from '@sentry/integrations';

const METAMASK_ENVIRONMENT = process.env['METAMASK_ENVIRONMENT'] || 'local'; // eslint-disable-line dot-notation
// const SENTRY_DSN_PROD =
//   'https://ae39e4b08d464bba9fbf121c85ccfca0@sentry.io/2299799'; // metamask-mobile
// const SENTRY_DSN_DEV =
//   'https://332890de43e44fe2bc070bb18d0934ea@sentry.io/2651591'; // test-metamask-mobile

export const SENTRY_DSN_PROD_TAI =
  'https://fdc5329953ad4d089c209193e0ea3298@o1406028.ingest.sentry.io/4503953424384000';
export const SENTRY_DSN_DEV_TAI =
  'https://fdc5329953ad4d089c209193e0ea3298@o1406028.ingest.sentry.io/4503953424384000';
/**
 * Required instrumentation for Sentry Performance to work with React Navigation
 */
export const routingInstrumentation =
  new Sentry.ReactNavigationV5Instrumentation();

// Setup sentry remote error reporting
export function setupSentry() {
  const environment =
    __DEV__ || !METAMASK_ENVIRONMENT ? 'development' : METAMASK_ENVIRONMENT;
  // const dsn = environment === 'production' ? SENTRY_DSN_PROD : SENTRY_DSN_DEV;
  const dsn =
    environment === 'production' ? SENTRY_DSN_PROD_TAI : SENTRY_DSN_DEV_TAI;
  Sentry.init({
    dsn,
    debug: __DEV__,
    environment,
    integrations: [
      new Dedupe(),
      new ExtraErrorData(),
      new Sentry.ReactNativeTracing({
        routingInstrumentation,
      }),
    ],
    tracesSampleRate: 0.2,
  });
}

// eslint-disable-next-line no-empty-function
export function deleteSentryData() {}
