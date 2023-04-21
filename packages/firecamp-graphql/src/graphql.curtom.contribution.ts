// @ts-nocheck

import * as mode from 'monaco-graphql/esm/graphqlMode';
import {
  LanguageServiceAPI,
  schemaDefault,
  formattingDefaults,
  modeConfigurationDefault,
} from 'monaco-graphql/esm/api';

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export * from 'monaco-graphql/esm/typings';

export const LANGUAGE_ID = 'graphqlDev';

class MonacoAPI {
  constructor() {
    return new LanguageServiceAPI({
      languageId: LANGUAGE_ID,
      schemaConfig: schemaDefault,
      formattingOptions: formattingDefaults,
      modeConfiguration: modeConfigurationDefault,
    });
  }
}

const initContribution = () => {
  // console.log(LANGUAGE_ID, 'LANGUAGE_ID...');
  monaco.languages.register({
    id: LANGUAGE_ID,
    extensions: ['.graphql', '.gql'],
    aliases: ['graphql'],
    mimetypes: ['application/graphql', 'text/graphql'],
  });

  const getMode = () => {
    return import('monaco-graphql/esm/graphqlMode');
  };
  monaco.languages.onLanguage(LANGUAGE_ID, async () => {
    // console.log(LANGUAGE_ID, 'LANGUAGE_ID...');
    debugger;
    const graphqlMode = await getMode();
    graphqlMode.setupMode(api);
  });
};

export { MonacoAPI, initContribution };
