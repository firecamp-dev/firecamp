import { Rest } from '@firecamp/cloud-apis';
import { EProvider, IAuthResponse } from './types';
import { validateAuthResponse } from './helper';
import { githubAuth, googleAuth } from './oauth2';

/**
 * credentials require while sign-in using Firecamp domain
 */
export interface ICredentials {
  username: string;
  password: string;
}

/**
 * sign-in user into their account via Firecamp, Google or GitHub domain
 */
export default async (
  provider: EProvider,
  credentials: ICredentials = { username: '', password: '' }
): Promise<{ response: IAuthResponse; provider: EProvider } | any> => {
  console.log(provider, 111);
  try {
    const { username = '', password = '' } = credentials;

    // TODO:
    // if (F.userMeta.isLoggedIn) return Promise.resolve();

    switch (provider) {
      case EProvider.LOCAL: {
        // Request to sign-in via Firecamp domain
        try {
          const response = await Rest.auth.signIn(username, password);

          // validate auth response
          if (validateAuthResponse(response?.data)) {
            return Promise.resolve({
              response: response.data,
              provider: EProvider.LOCAL,
            });
          } else
            return Promise.reject({
              message: 'failed to sign in into your account',
            });
        } catch (e) {
          console.log(e, 'e...');
          if (e.message == 'Network Error')
            e.message =
              'The service is unreachable, please check your internet connection.';
          return Promise.reject(e);
        }
      }
      case EProvider.GOOGLE: {
        // Fetch auth token
        const token = await googleAuth.authorize();

        // Send token to authenticate
        const response = await Rest.auth.viaGoogle(token);
        debugger;

        if (validateAuthResponse(response?.data)) {
          return Promise.resolve({
            response: response.data,
            provider: EProvider.GOOGLE,
          });
        } else
          return Promise.reject({
            message: 'Failed to sign-in into your account',
          });
      }
      case EProvider.GITHUB:
        // Fetch auth code
        githubAuth.authorize();

      // Send auth code to authenticate
      // const response = await Rest.auth.viaGithub(code);
      // console.log(response, "121212121")

      // if (validateAuthResponse(response?.data)) {
      //   return Promise.resolve({
      //     response: response.data,
      //     provider: EProvider.GITHUB,
      //   });
      // } else
      //   return Promise.reject({
      //     message: 'Failed to sign-in into your account',
      //   });

      default:
        console.log(provider);
        return Promise.reject({
          message: 'Failed to sign-in into your account',
        });
    }
  } catch (e) {
    console.log(e, 'e....');
    return Promise.reject({
      message: e?.data?.message
        ? `Failed to sign-in into your account: ${e.data.message || '-'}`
        : 'Failed to sign-in into your account',
    });
  }
};
