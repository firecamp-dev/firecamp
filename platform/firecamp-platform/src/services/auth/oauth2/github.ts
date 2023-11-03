import { EFirecampAgent } from '@firecamp/types';
import { _misc, _string } from '@firecamp/utils';
import { GITHUB_CONFIG } from './constants';

/**
 * TODO: TBD usage of getProfile argument
 */
export const authorize = async (): Promise<string> => {
  try {
    // Execute following logic when using electron agent
    if (_misc.firecampAgent() === EFirecampAgent.Desktop) {
      /** @ts-ignore */
      return window.__electron__.auth.github(
        GITHUB_CONFIG.CLIENT_ID,
        GITHUB_CONFIG.SCOPE
      );
    }
    // Execute following logic when using chrome extension
    else {
      // Web flow
      const redirectUrl =
        location.origin + '/identity.html?redirect=' + location.href;
      const url = `${GITHUB_CONFIG.AUTH_URL}?client_id=${
        GITHUB_CONFIG.CLIENT_ID
      }&redirect_uri=${redirectUrl}&scope=${GITHUB_CONFIG.SCOPE.join(',')}`;
      console.log(url);
      // @ts-ignore
      window.location = url;

      return Promise.resolve('');
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * TODO: Why GitHub OAuth2 chrome extension logic not exist?
 * de-authorize the user signed-in via GitHub OAuth2
 */
export const deAuthorize = async (): Promise<void> => {
  try {
    // Execute following logic when using electron agent
    if (_misc.firecampAgent() === EFirecampAgent.Desktop) {
      return window.fc.auth.logoutFromGithub();
    }

    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};
