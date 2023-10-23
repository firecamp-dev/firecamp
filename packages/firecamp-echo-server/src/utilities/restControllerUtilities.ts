export const parseAuthHeader = (authorizationHeader) => {
  const oauthParams = {};

  const oauthRegex = /(\w+)="([^"]+)"/g;

  let match;
  while ((match = oauthRegex.exec(authorizationHeader)) !== null) {
    oauthParams[match[1]] = match[2];
  }

  return oauthParams;
};