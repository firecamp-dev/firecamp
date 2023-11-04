import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/browser';
import { Integrations } from '@sentry/tracing';
import CloudApiGlobal, { Rest } from '@firecamp/cloud-apis';
import { ECloudApiHeaders } from '../types';
import _auth from '../services/auth';
import { EProvider } from '../services/auth/types';

const IdentityPage = () => {
  const [error, setError] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    console.log(urlParams);

    const code = urlParams.get('code');
    const _error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');

    if (errorDescription) setError(errorDescription);
    if (code) {
      CloudApiGlobal.setHost(process.env.FIRECAMP_API_HOST);
      // set  app version into cloud-api headers
      CloudApiGlobal.setGlobalHeaders({
        [ECloudApiHeaders.AppVersion]: process.env.APP_VERSION || '',
      });

      _auth
        .signIn(EProvider.GITHUB, { username: '', password: '' }, code)
        .then(async () => {
          localStorage.setItem(
            'authSuccessMessage',
            "You're signed in successfully."
          );
          //@ts-ignore
          window.location = '/'; //redirect to the main app
          // console.log(data, 12345);
        })
        .catch((e) => {
          setError(e.response?.data?.message || e.message);
        });
    }
  }, []);

  return (
    <>
      {error}
      <br />
      {error ? <a href="/">Go to Firecamp</a> : 'Authenticating...'}
    </>
  );
};

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
root.render(<IdentityPage />);