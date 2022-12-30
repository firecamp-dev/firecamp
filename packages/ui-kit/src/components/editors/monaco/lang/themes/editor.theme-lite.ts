import { editor } from 'monaco-editor';

const liteTheme: editor.IStandaloneThemeData = {
  base: 'vs',
  inherit: true,
  colors: {},
  rules: [
    { token: 'port', foreground: '#808080' },
    { token: 'variable', foreground: '#d96918', background: '#ffe4c4' },
    { token: 'invalid-variable', foreground: '808080' },
  ],
};
export default liteTheme;
