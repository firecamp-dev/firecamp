import { Rest } from '@firecamp/cloud-apis';
import { EProvider, IAuthResponse } from './types';

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
    return Promise.resolve({
      response: response.data,
      provider: EProvider.LOCAL,
    });
  } catch (e) {
    let message = e?.response?.data?.message || e.message;
    if (!message) {
      console.log(e.response, e);
      message = 'Failed to sign up for your account';
    }
    return Promise.reject({ message });
  }
};
