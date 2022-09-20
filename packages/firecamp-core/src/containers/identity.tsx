import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import { Integrations } from '@sentry/tracing';
import { useEffect, useState } from 'react';
import CloudApiGlobal, { Rest } from '@firecamp/cloud-apis';
import { ECloudApiHeaders } from '../types';
import { string } from 'prop-types';

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
      const client = localStorage.getItem('cid') || 123;

      // Set clientId
      if (client) {
        // Set client id and app version into cloud-api headers
        CloudApiGlobal.setGlobalHeaders({
          [ECloudApiHeaders.ClientId]: client,
          [ECloudApiHeaders.AppVersion]: process.env.APP_VERSION || '',
        });
      }

      Rest.auth
        .viaGithub(code)
        .then((rs) => {
          // TODO: move it to cookie based auth
          localStorage.setItem('token', rs.data.meta.access_token);
          localStorage.setItem(
            'authSuccessMessage',
            "You're signed in successfully."
          );
          //@ts-ignore
          window.location = '/'; //redirect to the main app
          console.log(rs, 12345);
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

ReactDOM.render(<IdentityPage />, document.getElementById('root'));
