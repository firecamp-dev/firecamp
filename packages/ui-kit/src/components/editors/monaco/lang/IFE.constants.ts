export const IFELanguages = {
  JSON: 'ife-json',
  XML: 'ife-xml',
  TEXT: 'ife-text', // Text which will support {{ }} formatting for varibale support
  HEADER_KEY: 'ife-header-key',
  HEADER_VALUE: 'ife-header-value',
};

export const getIFElanguage = (lang: string) => `ife-${lang}`;

export const MonacoLanguages = {
  JSON: 'json',
  XML: 'xml',
  TEXT: 'text',
};

export const IFEThemes = {
  DARK: 'ife-theme-dark',
  LITE: 'ife-theme-lite',
};
