import { loader, Monaco } from '@monaco-editor/react';
import { EEditorLanguage, EEditorTheme } from '@firecamp/types';
import EditorLangTextMonarch from './editor.lang-text';
import EditorDarkTheme from './themes/editor.theme-dark';
import EditorLiteTheme from './themes/editor.theme-lite';
import FirecampCompletionProvider from './editor.completion-provider';
import FirecampHoverProvider from './editor.hover-provider';

let monaco: Monaco;
export default (_callback: Function) => {
  loader.init().then((_monaco) => {
    monaco = _monaco;
    _registerLanguage(EEditorLanguage.FcText, EditorLangTextMonarch);
    _registerLanguage(EEditorLanguage.HeaderKey, EditorLangTextMonarch);
    _registerLanguage(EEditorLanguage.HeaderValue, EditorLangTextMonarch);

    /**
     * @bug Temporary fix the setTheme issue by setTimeout
     * TODO: Need to update the flow to call this function after DOM initialization
     */
    setTimeout(() => {
      monaco.editor.defineTheme(EEditorTheme.Dark, EditorDarkTheme);
      monaco.editor.defineTheme(EEditorTheme.Lite, EditorLiteTheme);
    });
    _callback?.();
  });
};
const _registerLanguage = (langId: string, langMonarch: any, cb = () => {}) => {
  monaco.languages.register({ id: langId });
  console.log(langId, 'lang before register');
  monaco.languages.onLanguage(langId, () => {
    monaco.languages.setMonarchTokensProvider(langId, langMonarch);
    // console.log(langId, langMonarch, 'lang after registering');
    cb();
  });
};

const _completionProviders = new Map(),
  _hoverProviders = new Map();
const SetCompletionProvider = (
  lang: EEditorLanguage,
  vars: { [k: string]: string }
) => {
  // console.log(_completionProviders, "_completionProviders");
  if (
    _completionProviders.has(lang) &&
    typeof _completionProviders.get(lang).dispose == 'function'
  ) {
    _completionProviders.get(lang).dispose();
  }
  const _coProvider = monaco.languages.registerCompletionItemProvider(
    lang,
    FirecampCompletionProvider(vars)
  );
  _completionProviders.set(lang, _coProvider);
};

const SetHoverProvider = (
  lang: EEditorLanguage,
  vars: { [k: string]: string }
) => {
  // console.log(_hoverProviders, "_hoverProviders");

  if (
    _hoverProviders.has(lang) &&
    typeof _hoverProviders.get(lang).dispose == 'function'
  ) {
    _hoverProviders.get(lang).dispose();
  }

  const _hProvider = monaco.languages.registerHoverProvider(
    lang,
    FirecampHoverProvider(vars)
  );
  _hoverProviders.set(lang, _hProvider);
};
export { SetCompletionProvider, SetHoverProvider };
