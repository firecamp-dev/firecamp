import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/browser';
import { Integrations } from '@sentry/tracing';

import App from './App';

// console.log(window.location);
if (process.env.NODE_ENV == 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,

    // Alternatively, use `process.env.npm_package_version` for a dynamic release version
    // if your build tool supports it.
    release: `Firecamp@${process.env.APP_VERSION}`,

    //@ts-ignore
    integrations: [new Integrations.BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);