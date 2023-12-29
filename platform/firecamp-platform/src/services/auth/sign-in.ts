import { Rest } from '@firecamp/cloud-apis';
import { _misc } from '@firecamp/utils';
import { EFirecampAgent } from '@firecamp/types';
import { EProvider, IAuthResponse } from './types';
import { githubAuth, googleAuth } from './oauth2';
import { ecies } from '../ecies/ecies';

/** credentials require while sign-in using Firecamp domain */
export interface ICredentials {
  username: string;
  password: string;
}

/**  sign-in user into their account via Firecamp, Google or GitHub */
export default async (
  provider: EProvider,
  credentials: ICredentials = { username: '', password: '' },
  code?: string // if github/google auth from web then oauth code will exist from oauth web redirect method
): Promise<{ response: IAuthResponse; provider: EProvider } | any> => {
  try {
    const { username = '', password = '' } = credentials;
    switch (provider) {
      case EProvider.LOCAL: {
        // request to sign-in via email/password
        try {
          const { data } = await Rest.auth.signIn(username, password);
          const {
            __meta: { accessToken, refreshToken },
          } = data;
          await ecies.setTokens(accessToken, refreshToken);
          // validate auth response
          return Promise.resolve({
            response: data,
            provider: EProvider.LOCAL,
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

        return Promise.resolve({
          response: response.data,
          provider: EProvider.GOOGLE,
        });
      }
      case EProvider.GITHUB:
        // fetch auth code
        const oAuthCode =
          _misc.firecampAgent() == EFirecampAgent.Desktop
            ? await githubAuth.authorize.electron()
            : code;

        // send auth code to authenticate

        return Rest.auth
          .viaGithub(oAuthCode)
          .then(async ({ data }) => {
            if (data) {
              const {
                __meta: { accessToken, refreshToken },
              } = data;
              await ecies.setTokens(accessToken, refreshToken);
              return Promise.resolve({
                response: data,
                provider: EProvider.GITHUB,
              });
            } else {
              return Promise.reject({
                message: 'failed to login into your account',
              });
            }
          })
          .catch((e) => {
            // setError(e.response?.data?.message || e.message);
          });

      default:
        console.log(provider);
        return Promise.reject({
          message: 'failed to login into your account',
        });
    }
  } catch (e) {
    console.log(e, 'e....');
    return Promise.reject({
      message: e?.data?.message
        ? `failed to login into your account: ${e.data.message || '-'}`
        : 'failed to login into your account',
    });
  }
};
