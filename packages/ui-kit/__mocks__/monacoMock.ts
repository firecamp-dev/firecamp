//@ts-nocheck
const mock = {
  languages: {
    register: function(language) {},
    setMonarchTokensProvider: function(name, tokens) {},
    registerCompletionItemProvider: function(name, provider) {}
  },
  editor: {
    defineTheme: function(name, theme) {}
  }
};
export default mock;

