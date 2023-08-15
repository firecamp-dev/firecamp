import { Rest } from '@firecamp/cloud-apis';
/**
 * request to send token on email via calling forgot password API
 */
export default async (email: string): Promise<any> =>
  Rest.auth.forgetPassword(email);
