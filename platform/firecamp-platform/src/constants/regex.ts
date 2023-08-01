export const Regex = {
  //@ref= https://stackabuse.com/validate-email-addresses-with-regular-expressions-in-javascript/
  Email: new RegExp(
    "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
  ),

  /**
   * allow alphanumeric and underscore
   * don't allow spaces and special characters
   * characters range between 6 to 20
   */
  Username: /^[a-zA-Z0-9\_]{6,20}$/,
  WorkspaceName: /^[a-zA-Z0-9\_]{6,20}$/,
  OrgName: /^[a-zA-Z0-9\_]{4,20}$/,

  /**
   * don't allow any special character
   * @ref:  https://stackoverflow.com/a/23127284
   * allows: colName, colName_, _colNmae, col_name
   * not allow" colName. , colName?, colName/@ or any special character in the name
   * TODO: add character range
   */
  CollectionName: /^(?![\s\S]*[^\w -]+)[\s\S]*?$/im,
  FolderName: /^(?![\s\S]*[^\w -]+)[\s\S]*?$/im, // same as collection name
  EnvironmentName: /^(?![\s\S]*[^\w -]+)[\s\S]*?$/im, // same as collection name
};
