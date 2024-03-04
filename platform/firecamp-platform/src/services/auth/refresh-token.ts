import { Rest } from '@firecamp/cloud-apis';
import { EProvider, IRefreshTokenResponse } from './types';
import { githubAuth, googleAuth } from './oauth2';
// import initApp from '../init-app'

export interface IRefreshToken {
  provider: EProvider;
  email: string;
  password?: string;
}

/**
 * TODO: Default value
 * Request to re-authenticate the user
 */
export default async ({
  provider = EProvider.LOCAL,
  email = '',
  password = '',
}: IRefreshToken): Promise<IRefreshTokenResponse> => {
  let response: IRefreshTokenResponse;

  try {
    switch (provider) {
      // Re-LogIn via firecamp
      case EProvider.LOCAL:
        response = await Rest.auth.refreshToken.reLogin({
          provider,
          email,
          password,
        });
        break;

      // Re-LogIn via google
      case EProvider.GOOGLE:
        let token = await googleAuth.authorize();
        if (token) {
          response = await Rest.auth.refreshToken.reLogin({
            provider,
            email,
            accessToken: token,
          });
        }
        break;

      // re-logIn via gitHub
      case EProvider.GITHUB:
        const code = await githubAuth.authorize.electron();

        if (code) {
          response = await Rest.auth.refreshToken.reLogin({
            provider,
            email,
            code,
          });
        }
        break;
    }

    if ([200, 201].includes(response.status)) {
      // Fetch existing user from DB
      // const user = await db.firecamp.fetch('user')
      // if (user) {
      //     // Update accessTokenfrom response
      //     user.accessToken = response?.data?.accessToken

      //     // Update user in DB
      //     update('user', user)
      // }

      // Re-initialize the app
      // await initApp()

      return Promise.resolve(response);
    } else {
      console.error({
        API: 'app.auth.refreshToken',
        args: { provider, payload: { provider, email, password } },
        error: 'Invalid status code',
      });

      return Promise.reject({
        message: 'Failed to re-login',
      });
    }
  } catch (error) {
    console.error({
      API: 'app.auth.refreshToken',
      args: { provider, payload: { provider, email, password } },
      error,
    });
    return Promise.reject(error);
  }
};
