const Environment = {
  Development: 'development',
  Staging: 'staging', // staging will be for testing purpose
  Production: 'production',
  Canary: 'canary', // Canary is production but for early adopter
};

const AppFormat = {
  WebApp: 'webapp',
  Dmg: 'dmg',
  AppImage: 'appImage',
  Snap: 'snap',
  NSIS: 'nsis',
};

module.exports = { Environment, AppFormat };
