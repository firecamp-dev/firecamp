export const parseAuthHeader = (authorizationHeader) => {
  const oauthParams = {};

  const oauthRegex = /(\w+)="([^"]+)"/g;

  let match;
  while ((match = oauthRegex.exec(authorizationHeader)) !== null) {
    oauthParams[match[1]] = match[2];
  }

  return oauthParams;
};

export const buildOauthSignatureBase = (httpMethod, baseUrl, oauthParameters) => {
  // Sort the OAuth parameters alphabetically by name
  const sortedParameters = Object.keys(oauthParameters)
    .sort()
    .filter((key) => key !== 'oauth_signature')
    .map((key) => key + '=' + encodeURIComponent(oauthParameters[key]));

  // Create the parameter string by joining the sorted parameters with "&"
  const parameterString = sortedParameters.join('&');

  // Encode the HTTP method and base URL
  const encodedHttpMethod = encodeURIComponent(httpMethod);
  const encodedBaseUrl = encodeURIComponent(baseUrl);

  // Construct the signature base string
  const signatureBase = `${encodedHttpMethod}&${encodedBaseUrl}&${encodeURIComponent(
    parameterString
  )}`;

  return signatureBase;
}