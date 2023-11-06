import { EFirecampAgent } from '@firecamp/types';
import { _misc, _string } from '@firecamp/utils';
import { GITHUB_CONFIG } from './constants';

const { CLIENT_ID, SCOPE, AUTH_URL, REDIRECT_URL } = GITHUB_CONFIG;

export const authorize = {
  electron: (): Promise<string> => {
    /** @ts-ignore */ // it will return tne code from github oauth
    return window.__electron__.auth.github(CLIENT_ID, SCOPE);
  },
  web: (): void => {
    // web flow
    const scope = SCOPE.join(',');
    const redirectUrl = `${REDIRECT_URL}/?redirect=${location.href}`;
    const url = `${AUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${redirectUrl}&scope=${scope}`;
    // console.log(url);
    // @ts-ignore
    window.location = url;
  },
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
