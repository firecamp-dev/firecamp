export enum EConverterLang {
  JSON = 'json',
  XML = 'xml',
  YAML = 'yaml',
  JS = 'js',
}

export interface ISourceState {
  /**
   * Source alowed types/ languages
   */
  allowedTypes: object;

  /**
   * Source data type
   */
  type: string;

  /**
   * Source data
   */
  body: string;

  /**
   * Boolean value if source is getting updating or not
   */
  isUpdating?: boolean;

  /**
   * Boolean value whether source data type detected or not
   */
  hasTypeDetected?: boolean;

  /**
   * Boolean value whether source data has error or not
   */
  hasError?: boolean;
}
