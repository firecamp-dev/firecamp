import { EFirecampAgent } from '@firecamp/types';
import { _misc } from '@firecamp/utils';
import { GOOGLE_CONFIG } from './constants';

/**
 * TODO: TBD usage of getProfile argument
 * @returns
 */
export const authorize = async (): Promise<string> => {
  try {
    // Execute following logic when using electron agent
    if (_misc.firecampAgent() === EFirecampAgent.Desktop) {
      return window.fc.auth.loginViaGoogle({
        authorize_url: GOOGLE_CONFIG.AUTHORIZE_URL,
        clientId: GOOGLE_CONFIG.CLIENT_ID,
        scope: GOOGLE_CONFIG.SCOPE,
        redirect_url: GOOGLE_CONFIG.REDIRECT_URI,
        response_type: GOOGLE_CONFIG.RESPONSE_TYPE,
      });
    }
    // Execute following logic when using chrome extension
    else {
      // Execute chrome extension oauth2 authorization logic
      return new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
          // Return if authentication failed
          if (chrome.runtime.lastError) reject(chrome.runtime.lastError);

          // Resolve the authentication token
          resolve(token);
        });
      });
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * de-authorize the user signed-in via Google OAuth2
 */
export const deAuthorize = async (): Promise<void> => {
  try {
    // Execute following logic when using electron agent
    if (_misc.firecampAgent() === EFirecampAgent.desktop) {
      return window.fc.auth.logoutFromGoogle();
    }
    // Execute following logic when using chrome extension
    else {
      // Execute chrome extension oauth2 de-authorization logic
      return new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
          // Return if authentication failed
          if (chrome.runtime.lastError) reject(chrome.runtime.lastError);

          // De-authorize signed-in user by revoke token
          if (token) {
            // Request to revoke token
            const xhr = new XMLHttpRequest();

            xhr.open(
              'GET',
              `https://accounts.google.com/o/oauth2/revoke?token=${token}`
            );

            xhr.send();

            // Remove cached token from chrome extension
            chrome.identity.removeCachedAuthToken({ token }, resolve);
          } else reject('Failed to sign-out');
        });
      });
    }
  } catch (error) {
    return Promise.reject(error);
  }
};
