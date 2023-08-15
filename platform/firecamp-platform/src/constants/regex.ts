export const Regex = {
  //@ref= https://stackabuse.com/validate-email-addresses-with-regular-expressions-in-javascript/
  Email: new RegExp(
    "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
  ),

  EmailOrUsername:
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+|^[0-9a-zA-Z ]+$/,

  /**
   * allow alphanumeric and single hyphen
   * don't allow spaces and special characters
   * characters range between 6 to 20
   * @ref: https://github.com/shinnn/github-username-regex/blob/master/index.js
   */
  Username: /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){5,19}$/i,
  WorkspaceName: /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){5,19}$/i,
  OrgName: /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){3,19}$/i,

  /**
   * don't allow any special character
   * @ref:  https://stackoverflow.com/a/23127284
   * allows: colName, colName_, _colName, col_name
   * not allow" colName. , colName?, colName/@ or any special character in the name
   * TODO: add character range
   */
  CollectionName: /^(?![\s\S]*[^\w -]+)[\s\S]*?$/im,
  FolderName: /^(?![\s\S]*[^\w -]+)[\s\S]*?$/im, // same as collection name
  EnvironmentName: /^(?![\s\S]*[^\w -]+)[\s\S]*?$/im, // same as collection name
};
