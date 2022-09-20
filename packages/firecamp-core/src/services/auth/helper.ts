import { IAuthResponse } from './types';

// Validate auth API response
export const validateAuthResponse = (response: IAuthResponse): boolean => {
  if (
    response?.user?.email &&
    response?.user?._meta?.id &&
    response?.meta?.access_token &&
    response?.meta?.active_workspace &&
    response?.workspace?.name &&
    response?.workspace?.meta?.is_default &&
    response?.workspace?.meta?.type &&
    response?.workspace?._meta?.id
  )
    return true;

  return false;
};
