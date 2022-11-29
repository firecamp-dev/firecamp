// @ts-nocheck
import { loader } from '@monaco-editor/react';
// import * as monaco from 'monaco-editor';
import IFELangText from './IFE.lang-text';
import FirecampDarkTheme from './themes/firecamp.dark.theme';
import FirecampLiteTheme from './themes/firecamp.lite.theme';
import FirecampCompletionProvider from './firecamp.completion-provider';
import FirecampHoverProvider from './firecamp.hover-provider';
import { IFELanguages, IFEThemes } from './IFE.constants';

let { TEXT, HEADER_KEY, HEADER_VALUE } = IFELanguages;

let monaco;
export default (_callback) => {
  loader.init().then((_monaco) => {
    monaco = _monaco;
    _registerLanguage(TEXT, IFELangText);
    _registerLanguage(HEADER_KEY, IFELangText);
    _registerLanguage(HEADER_VALUE, IFELangText);

    /**
     * @bug Temporary fix the setTheme issue by setTimeout
     * TODO: Need to update the flow to call this function after
     * TODO: DOM initialization
     */
    setTimeout(() => {
      monaco.editor.defineTheme(IFEThemes.DARK, FirecampDarkTheme);
      monaco.editor.defineTheme(IFEThemes.LITE, FirecampLiteTheme);
    });
    _callback?.();
  });
};
const _registerLanguage = (langId, langMonarch, cb = () => {}) => {
  monaco.languages.register({ id: langId });
  console.log(langId, 'lang before register');
  monaco.languages.onLanguage(langId, () => {
    monaco.languages.setMonarchTokensProvider(langId, langMonarch);
    console.log(langId, langMonarch, 'lang after registering');
    cb();
  });
};

let _completionProviders = new Map(),
  _hoverProviders = new Map();
const SetCompletionProvider = (lang, vars) => {
  // console.log(_completionProviders, "_completionProviders");

  if (
    _completionProviders.has(lang) &&
    typeof _completionProviders.get(lang).dispose == 'function'
  ) {
    _completionProviders.get(lang).dispose();
  }
  let _coProvider = monaco.languages.registerCompletionItemProvider(
    lang,
    FirecampCompletionProvider(vars)
  );
  _completionProviders.set(lang, _coProvider);
};

const SetHoverProvider = (lang, vars) => {
  // console.log(_hoverProviders, "_hoverProviders");

  if (
    _hoverProviders.has(lang) &&
    typeof _hoverProviders.get(lang).dispose == 'function'
  ) {
    _hoverProviders.get(lang).dispose();
  }

  let _hProvider = monaco.languages.registerHoverProvider(
    lang,
    FirecampHoverProvider(vars)
  );
  _hoverProviders.set(lang, _hProvider);
};

export { SetCompletionProvider, SetHoverProvider };
