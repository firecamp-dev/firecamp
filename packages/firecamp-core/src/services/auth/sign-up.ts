import { Rest } from '@firecamp/cloud-apis';
import { EProvider, IAuthResponse } from './types';
import { validateAuthResponse } from './helper';

/**
 * credentials require for sign-up using Firecamp domain
 */
export interface ICredentials {
  username: string;
  password: string;
  email: string;
}

/**
 * sign-up via Firecamp domain
 */
export default async ({
  username,
  password,
  email,
}: ICredentials): Promise<{ response: IAuthResponse; provider: EProvider }> => {
  try {
    // Request to sign-up via Firecamp domain
    const response = await Rest.auth.signUp(username, email, password);

    // validate auth response
    if (validateAuthResponse(response?.data)) {
      return Promise.resolve({
        response: response.data,
        provider: EProvider.LOCAL,
      });
    } else
      return Promise.reject({
        message: 'Failed to sign-up for your account',
      });
  } catch (error) {
    return Promise.reject({
      message: error?.data?.message
        ? `Failed to sign-up for your account: ${error.data.message || '-'}`
        : 'Failed to sign-up for your account',
    });
  }
};
