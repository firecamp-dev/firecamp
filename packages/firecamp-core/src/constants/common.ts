export const PROVIDER = {
  LOCAL: 'local',
  GOOGLE: 'google',
  GITHUB: 'github',
};

export const RE = {
  /**
   * don't allow any special character
   * @ref:  https://stackoverflow.com/a/23127284
   * allows: colName, colName_, _colNmae, col_name
   * not allow" colName. , colName?, colName/@ or any special character in the name
   */
  CollectionName: /^(?![\s\S]*[^\w -]+)[\s\S]*?$/im,
  // TODO: later merged both regex in one CollectionName & NoSpecialCharacters
  NoSpecialCharacters: /^(?![\s\S]*[^\w -]+)[\s\S]*?$/im,
};

export const AUTH_WALL_MESSAGES = {
  PREVENT_ADD_API_COLLECTION:
    'To create an <u>API collection</u>, you must first be logged into your account.',
  PREVENT_ADD_FOLDER:
    'To create a <u>folder</u>, you must first be logged into your account.',
  PREVENT_ADD_REQUEST:
    'To save a <u>request</u>, you must first be logged into your account.',
  PREVENT_OPEN_SETTINGS_MODAL:
    'To access <u>settings and configurations</u>, you must first be logged into your account.',
  PREVENT_OPEN_COOKIES_MODAL:
    'To manage  <u>cookies</u>, you must first be logged into your account.',
  PREVENT_OPEN_SSL_PROXY_MODAL:
    'To manage <u>SSL and proxies</u>, you must first be logged into your account.',
  PREVENT_RENAME_API_COLLECTION:
    'To rename an <u>API collection</u>, you must first be logged into your account.',
  PREVENT_RENAME_FOLDER:
    'To rename a <u>folder</u>, you must first be logged into your account.',
  PREVENT_IMPORT_API_COLLECTION:
    'To import an <u>API collection</u>, you must first be logged into your account.',
};
