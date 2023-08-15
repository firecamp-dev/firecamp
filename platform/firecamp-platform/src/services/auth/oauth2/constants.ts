/**
 * Google OAuth2 config
 */
export const GOOGLE_CONFIG = {
  AUTHORIZE_URL: 'https://accounts.google.com/o/oauth2/v2/auth',
  CLIENT_ID: process.env.GOOGLE_OAUTH2_CLIENT_ID,
  SCOPE: 'https://www.googleapis.com/auth/userinfo.email',
  RESPONSE_TYPE: 'token',
  REDIRECT_URI: process.env.GOOGLE_OAUTH2_REDIRECT_URI,
};

/**
 * GitHub OAuth2 config
 */
export const GITHUB_CONFIG = {
  CLIENT_ID: process.env.GITHUB_OAUTH2_CLIENT_ID,
  REDIRECT_URL: process.env.GITHUB_OAUTH2_REDIRECT_URI,
  AUTH_URL: 'https://github.com/login/oauth/authorize',
  SCOPE: ['user:email'],
};
